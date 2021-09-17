(() => {

  const app = {

    initialize() {
      moment.locale('nl-be');
      
      this.tinderApi = new TinderApi();
      
      this.users = null;
      this.messages = null;
      this.currentUserId = null;
      this.currentMessageId = null;
      
      this.cacheElement();
      this.fetchUsers();
      this.registerListeners();
    },

    cacheElement() {
      this.$users = document.querySelector('.users__list');
      this.$messagesOut = document.querySelector('.messages__out');
      this.$messagesIn = document.querySelector('.messages__in');
      this.$matches = document.querySelector('.matches__list');
      this.$noMatches = document.querySelector('.no-matches__list');
      this.$conversation = document.querySelector('.conversations__list');
      this.$conversationUser = document.querySelector('.conversation__user');
      this.$createMessageForm = document.querySelector('#create__message');
    },

    registerListeners() {
      this.$users.addEventListener('click', ev => {
        const userId = ev.target.dataset.id || ev.target.parentNode.dataset.id || ev.target.parentNode.parentNode.dataset.id;
        this.setActiveUser(userId);
      });
      
      this.$messagesIn.addEventListener('click', ev => {
        const friendId = ev.target.dataset.id || ev.target.parentNode.dataset.id || ev.target.parentNode.parentNode.dataset.id;
        this.setActiveConversation(friendId);
      });

      this.$messagesOut.addEventListener('click', ev => {
        const friendId = ev.target.dataset.id || ev.target.parentNode.dataset.id || ev.target.parentNode.parentNode.dataset.id;
        this.fetchConversation(this.currentUserId, friendId)
      });

      this.$createMessageForm.addEventListener('submit', async ev => {

        ev.preventDefault();
        
        messageToCreate = {
          message: ev.target['text__message'].value,
          senderId: this.currentUserId,
          receiverId: this.currentMessageId
        };
        
        await this.tinderApi.addMessageBetweenUsers(messageToCreate);
        this.fetchConversation(this.currentUserId, this.currentMessageId)
      });

      this.$noMatches.addEventListener('click', async ev => {

        ev.preventDefault();

        const id = ev.target.dataset.id || ev.target.parentNode.dataset.id || ev.target.parentNode.parentNode.dataset.id;
        const rating = ev.target.dataset.rating || ev.target.parentNode.dataset.rating || ev.target.parentNode.parentNode.dataset.rating;
        
        matchToCreate = {
          rating: rating,
          senderId: this.currentUserId,
          receiverId: id
        };

        await this.tinderApi.addMatch(matchToCreate);
        this.fetchMatchesByUserId(this.currentUserId)
      });
    },

    async fetchUsers() {
      this.users = await this.tinderApi.getUsers();
      this.generateUiForUsers();

      const userId = this.users[0].id;
      this.setActiveUser(userId)
    },

    generateUiForUsers() {
      const userList = this.users.map(u => {
        return `<li class="user__list__item">
                  <a href="#" data-id="${u.id}">
                    <div class="user__thumbnail">
                      <img src="${u.picture.thumbnail}">
                    </div>
                    <p>${u.firstName} ${u.lastName}</p>
                  </a>
                </li>`
      }).join('')
      this.$users.innerHTML = userList
    },

    setActiveUser(userId) {
      this.currentUserId = userId;
      const $selectedUser = this.$users.querySelector(`.user__list__item.active`);
      if ($selectedUser !== null) {
        $selectedUser.classList.remove('active');
      }
      this.$users.querySelector(`.user__list__item > a[data-id="${userId}"]`).parentNode.classList.add('active');
      this.fetchMessagesSentByUserId(userId);
      this.fetchMessagesReceivedByUserId(userId);
      this.fetchMatchesByUserId(userId);
      this.fetchConversation(userId)
    },

    async fetchMessagesSentByUserId(userId) {
      this.messages = await this.tinderApi.getSentMessagesFromUser(userId);
      this.generateUiMessagesSent(userId);
    },

    generateUiMessagesSent() {
      const messagesList = this.messages.map(m => {
        
        document.querySelector('.outbox .amount').innerHTML = `<p>${this.messages.length}</p>`

        const name = this.users.find(u => u.id === m.receiverId)
        const date = new Date(m.createdAt);
        const dateY = date.toLocaleString('en-GB', { month: 'short', day: 'numeric'})
        const dateT = date.toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit'})
        return `<li class="message__list__item">
                  <a href="#" data-id="${m.receiverId}">
                  <div class="title__date">
                  <h2>${name.firstName} ${name.lastName}</h2>
                  <div class="date">
                    <p>${dateY} ${dateT}</p>
                  </div>
                </div>
                <p>${m.message}</p>
                  </a>
                </li>`
      }).join('')
      this.$messagesOut.innerHTML = messagesList
    },

    async fetchMessagesReceivedByUserId(userId) {
      this.messages = await this.tinderApi.getReceivedMessagesFromUser(userId);
      this.generateUiMessagesReceived(userId);
    },

    generateUiMessagesReceived(userId) {
          const messagesInList = this.messages.map(m => {

            document.querySelector('.inbox .amount').innerHTML = `<p>${this.messages.length}</p>`
            
            const name = this.users.find(u => u.id === m.senderId)

            const date = new Date(m.createdAt);
            const dateY = date.toLocaleString('en-GB', { month: 'short', day: 'numeric'})
            const dateT = date.toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit'})
            return `<li class="message__list__item">
                      <a href="#" data-id="${m.senderId}">
                        <div class="title__date">
                          <h2>${name.firstName} ${name.lastName}</h2>
                          <div class="date">
                            <p>${dateY} ${dateT}</p>
                          </div>
                        </div>
                        <p>${m.message}</p>
                      </a>
                    </li>`
          }).join('')
          this.$messagesIn.innerHTML = messagesInList

          const friendId = this.messages[0].senderId;
          this.setActiveConversation(friendId)
    },

    setActiveConversation(messageId) {
      this.currentMessageId = messageId;

      const $selectedMessage = this.$messagesIn.querySelector(`.message__list__item.test`);
      if ($selectedMessage !== null) {
        $selectedMessage.classList.remove('test');
      }
      this.$messagesIn.querySelector(`.message__list__item > a[data-id="${messageId}"]`).parentNode.classList.add('test');

      this.fetchConversation(this.currentUserId, messageId)
    },

    async fetchConversation(userId, friendId) {
      this.conversation = await this.tinderApi.getConversationBetweenUsers(userId, friendId);
      this.generateUiForConversation(userId, friendId)
    },

    generateUiForConversation(userId, friendId) {
      const conversationList = this.conversation.map(c => {

      const name = this.users.find(u => u.id === c.senderId)

      const date = new Date(c.createdAt);
          const dateY = date.toLocaleString('en-GB', { month: 'short', day: 'numeric'})
          const dateT = date.toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit'})

        return `<li class="conversation__list__item ${(c.senderId === userId ? 'sent' : 'received')}" data-id="${c.id}">
                  <div class="conversation__title">
                  <h4>${(c.senderId === userId) ? 'You' : `${name.firstName} ${name.lastName}`}</h4>
                  <h5 class="conversation__date">${dateY} ${dateT}</h5>
                  </div>

                  <div class="conversation__flex">
                    <div class="conversation__img">
                      ${(c.senderId === userId) ? '' : `<img src="${name.picture.thumbnail}">`}
                    </div>
                    <div class="conversation__content">
                      <p>${c.message}</p>
                    </div>
                  </div>
                  
                </li>`
      }).join('');
      this.$conversation.innerHTML = conversationList

      const friendInfo = this.users.find(f => f.id === friendId)
      const userDisplay = `<div class="conversation__info">
                            <div class="info__img">
                              <img src="${friendInfo.picture.medium}">
                            </div>

                            <div class="user__name">
                              <h2>${friendInfo.firstName} ${friendInfo.lastName}</h2>
                            </div>
                          </div>`

      this.$conversationUser.innerHTML = userDisplay
    },

    async fetchMatchesByUserId(userId) {
      this.matches = await this.tinderApi.getMatchesForUser(userId);
      this.generateUiForMatches(userId);
      this.generateUiForNonMatches(userId);
    },

    generateUiForMatches(userId) {

        const matchesList = this.matches.map(m => {

          const name = this.users.find(u => ((userId !== m.friendId) ? u.id === m.friendId : u.id === m.userId))

            function searchIcon () {
              if (m.rating === 'like') {
                return '<img src="static/img/like.svg">'
              } else if (m.rating === 'dislike') {
                return '<img src="static/img/dislike.svg">'
              } else if (m.rating === 'superlike') {
                return '<img src="static/img/superlike.svg">'
              }
            };
            
            function response() {
              if (userId !== m.userId) {
                return '<img src="static/img/response.svg">'
              } else {
                return ''
              }
            };

            function calcAge () {
              var ageGiven = Date.now() - name.dayOfBirth;
              var age = new Date(ageGiven);

              return Math.abs(age.getUTCFullYear() - 1970)
            };
            
          document.querySelector('.matches .amount').innerHTML = `<p>${this.matches.length}</p>`
          
          return `<li class="matches__list__item">
                    <div class="matches__content">
                      <div class="matches__img">
                        <img src="${name.picture.medium}">
                      </div>
                      <div class="matches__title">
                        <div>
                          <h2>${name.firstName} ${name.lastName}</h2>
                          <p>${calcAge()}</p>
                        </div>
                      </div>
                      <div class="matches__rating">
                        ${response()} ${searchIcon()}
                      </div>
                    </div>
                  </li>`
        }).join('')
        this.$matches.innerHTML = matchesList
    },

    generateUiForNonMatches(userId) {

      const nonMatchList = this.users.map(u => {

        function calcAge () {
          var ageGiven = Date.now() - u.dayOfBirth;
          var age = new Date(ageGiven);

          return Math.abs(age.getUTCFullYear() - 1970)
        };

        return `<li class="matches__list__item">
                  <div class="matches__content">
                    <div class="matches__img">
                      <img src="${u.picture.medium}">
                    </div>

                    <div class="matches__title matches__title__long">
                        <div>
                          <h2>${u.firstName} ${u.lastName}</h2>
                          <p>${calcAge()}</p>
                        </div>
                    </div>
                  </div>

                  <ul class="rate__me">
                    <li data-id="${u.id}" data-rating="dislike"><a href=""><img src="static/img/dislike.svg"></a></li>
                    <li data-id="${u.id}" data-rating="superlike"><a href=""><img src="static/img/superlike.svg"></a></li>
                    <li data-id="${u.id}" data-rating="like"><a href=""><img src="static/img/like.svg"></a></li>
                  </ul>
                </li>`

        }).join('')

        this.$noMatches.innerHTML = nonMatchList

    },

  }

  app.initialize();

})();