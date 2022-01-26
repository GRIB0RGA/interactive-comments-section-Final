//? VARIABLES
export const commentSectionContainer = document.querySelector(
  `.commentSectionContainer`
);

//? Functions
const clearSection = (Section) => (Section.innerHTML = ``);

// prettier-ignore
const updateAndInjectHtml = (id,score,picture,username,createdAt,commentContent,whereToInject,replyingTo) => {
    const html = `
    <div class="comment" id="${id}">
       <div class="comment__raiting">
         <div
           class="comment__raiting__operator comment__raiting__operator--like"
         >+</div>
         <div class="comment__raiting--score">${score}</div>
         <div
           class="comment__raiting__operator comment__raiting__operator--dislike"
         >-</div>
       </div>
       <!-- comment__raiting ends here -->
       <div class="comment__content">
           <div class="comment__content__topRow">
               <div class="userSide">
                   <img src="assets/${picture}" alt="${username}" class="userSide__post__img">
                   <p class="userSide__post__username">${username}</p>
                   <span class="userSide__post__badge">you</span>
                   <p class="userSide__post__date">${createdAt}</p>
               </div> 
               <div class="tools ">
                   <div class="tools__type tools__type--replay">
                       <img src="assets/images/icon-reply.svg" alt="replay" />
                       <p class="tool tool--replay">Replay</p>
                     </div>
                   <div class="tools__type tools__type--del">
                       <img src="assets/images/icon-delete.svg" alt="delete" />
                       <p class="tool tool--delete">Delete</p>
                     </div>
                     <div class="tools__type tools__type--edit">
                       <img src="assets/images/icon-edit.svg" alt="edit" />
                       <p class="tool tool--btn">Edit</p>
                     </div>
               </div>
           </div>
           <!-- topRow ends here -->
           <div class="comment__content__bottomRow">
           <span class="commentText__replayTo">@${replyingTo}</span>
            <p class="commentText">${commentContent}</p>
           </div>
       </div>
       <!-- ccomment__content ends here -->
     </div>
     <div class="replayContainer" id="replCont${id}"></div>
    `;

   whereToInject.insertAdjacentHTML(`beforeend`,html)
}

const renderComments = (array) =>
  array.forEach((comment) => {
    updateAndInjectHtml(
      comment.id,
      comment.score,
      comment.user.image.webp,
      comment.user.username,
      comment.createdAt,
      comment.content,
      commentSectionContainer
    );
  });

const renderReplies = (array) =>
  array.forEach((comment) =>
    comment.replies.forEach((replay) => {
      // so i would know where to inject
      const replayContainerS = [
        ...document.querySelectorAll(`.replayContainer`),
      ];
      const replayContainer = replayContainerS.filter(
        (replCont) => replCont.id.slice(-1) == comment.id
      )[0];

      updateAndInjectHtml(
        replay.id,
        replay.score,
        replay.user.image.webp,
        replay.user.username,
        replay.createdAt,
        replay.content,
        replayContainer,
        replay.replyingTo
      );
    })
  );

const checkCommentTypes = (currentUsername) => {
  // prettier-ignore
  const commentUsernamesList = document.querySelectorAll(`.userSide__post__username`);
  commentUsernamesList.forEach((username) => {
    const commentUsername = username.textContent;
    const badge = username.nextElementSibling;
    /// TOOL BUTTONS START
    const toolsDelBtn = username
      .closest(`.comment__content__topRow`)
      .querySelector(`.tools`)
      .querySelector(`.tools__type--del`);
    const toolsEditBtn = toolsDelBtn.nextElementSibling;
    const toolsReplayBtn = toolsDelBtn.previousElementSibling;
    /// TOOL BUTTONS END
    // replay to
    const replayToContainer = username
      .closest(`.comment`)
      .closest(`.replayContainer`);
    const replayTo = username
      .closest(`.comment`)
      .querySelector(`.comment__content__bottomRow`)
      .querySelector(`.commentText__replayTo`);

    //? LOGIC
    if (commentUsername === currentUsername) {
      toolsReplayBtn.classList.add(`hidden`);
    }
    if (commentUsername !== currentUsername) {
      badge.classList.add(`hidden`);
      toolsDelBtn.classList.add(`hidden`);
      toolsEditBtn.classList.add(`hidden`);
    }
    if (replayToContainer === null) {
      replayTo.classList.add(`hidden`);
    }
  });
};

// prettier-ignore
export const renderCurrentUserCommentingSection = (currentUserPicture, whereToInject,type) => {
  let textAreaId = `userMainInput`
  let buttonId = `userSendBtn`
  let buttonText =`Send`
  let injectDirection = `afterend`
  
  if(type===`Replay`){
    textAreaId = `userReplayInput`
    buttonId = `userReplayBtn`
    buttonText =`Replay`
    injectDirection = `beforeend`
  }
  if(type==`Edit`){
    textAreaId = `userUpdateInput`
    buttonId = `userUptadeBtn`
    buttonText =`Update`
    injectDirection = `beforeend`
  }
  const currUserHtml = `
  <div class="userComment">
  <img
    class="userComment__img"
    src="${currentUserPicture}"
    alt=""
  />
  <textarea class="userComment__text" id="${textAreaId}" cols="50" rows="2.5" placeholder="Add a comment..."></textarea>
  <button class="userComment__send btn" id="${buttonId}">${buttonText}</button>
  </div>`;

  whereToInject.insertAdjacentHTML(injectDirection, currUserHtml);
};

export const updateUI = (sectionToClear, storageArr, currentUsername) => {
  clearSection(sectionToClear);
  renderComments(storageArr);
  renderReplies(storageArr);
  checkCommentTypes(currentUsername);
};
