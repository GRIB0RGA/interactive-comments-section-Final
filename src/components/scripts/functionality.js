import * as data from "../../data.json" assert { type: "json" };
const STORAGE_KEY = `comments`;
export let storage =
  JSON.parse(localStorage.getItem(STORAGE_KEY)) === null
    ? data.default.comments
    : JSON.parse(localStorage.getItem(STORAGE_KEY));

export const currentUserUsername = data.default.currentUser.username;
// prettier-ignore
export const currentUserPictureWebp = `assets${data.default.currentUser.image.webp.slice(1)}`;
const currentUserObj = data.default.currentUser;

import {
  updateUI,
  commentSectionContainer,
  renderCurrentUserCommentingSection,
} from "./renderFunctions.js";

const updateStorage = (key, storageObj) => {
  localStorage.setItem(
    key,
    JSON.stringify(storageObj.sort((a, b) => b.score - a.score))
  );
};

const nextId = function (storageArr) {
  let maxId = 0;
  storageArr.forEach((comment) => {
    // check comments
    if (comment.id > maxId) {
      maxId = comment.id;
    }
    // check replies
    comment?.replies.forEach((replay) => {
      if (replay.id > maxId) {
        maxId = replay.id;
      }
    });
    // check replies end
  });
  return maxId + 1;
};
// prettier-ignore
const insertCommentInLocalStorage = (currentUserObj, whereToPush, content) => {
  console.log(currentUserObj);
  whereToPush.push({
    id: nextId(storage),
    content: `${content}`,
    createdAt: `date`,
    replies: [],
    score: 0,
    user: {
      image: {
        png: `${currentUserObj.image.png}`,
        webp: `${currentUserObj.image.webp}`,
      },
      username: `${currentUserObj.username}`,
    },
  });
};
// prettier-ignore
const insertReplayInLocalStorage = (currentUserObj, whereToPush, content,replyingToName) => {
  whereToPush.push({
    id: nextId(storage),
    content: `${content}`,
    createdAt: `date`,
    replyingTo: `${replyingToName}`,
    score: 0,
    user: {
      image: {
        png: `${currentUserObj.image.png}`,
        webp: `${currentUserObj.image.webp}`,
      },
      username: `${currentUserObj.username}`,
    },
  });
};

//! COMMENT POSTING \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const writeComment = () => {
  const userMainInput = document.getElementById(`userMainInput`);
  if (userMainInput.value) {
    insertCommentInLocalStorage(
      currentUserObj,
      storage,
      userMainInput.value,
      storage
    );
    updateStorage(STORAGE_KEY, storage);
    //?render added comments
    updateUI(commentSectionContainer, storage, currentUserUsername);
    //? clear input
    userMainInput.value = ``;
  } else {
    userMainInput.classList.add(`shake`);
    setTimeout(function () {
      userMainInput.classList.remove(`shake`);
    }, 500);
  }
};

export const postComment = () => {
  const userSendBtn = document.getElementById(`userSendBtn`);
  userSendBtn.addEventListener(`click`, writeComment);
};

//! REPLAY \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

const addingRepliesAndRendering = (
  objToInject,
  commentID,
  Comment,
  username
) => {
  /// აქ ვემზადები ღილაკის დასაჭერად
  const replayBtn = document.getElementById(`userReplayBtn`);
  const replayText = document.getElementById(`userReplayInput`);
  // უკვე ვაჭერ ღილაკს და ვამატებ რეფლაის
  replayBtn.addEventListener(`click`, function () {
    // prettier-ignore
    let whereToPushIn = objToInject.filter((user) => user.id == commentID)[0]?.replies;
    console.log(objToInject.filter((user) => user.id == commentID)[0]);
    if (!whereToPushIn) {
      const mainCommentID =
        Comment.closest(`.replayContainer`).previousElementSibling.id;
      console.log(mainCommentID);
      whereToPushIn = objToInject.filter((user) => user.id == mainCommentID)[0]
        ?.replies;
    }
    // username

    // prettier-ignore
    insertReplayInLocalStorage(currentUserObj,whereToPushIn,replayText.value,username);
    updateStorage(STORAGE_KEY, storage);
    updateUI(commentSectionContainer, storage, currentUserUsername);
  });
};

export const replayFunc = (e) => {
  if (e.target.innerHTML === `Replay` && e.target.closest(`.comment`)) {
    const toolReplayBtn = e.target; //
    const userName = toolReplayBtn
      .closest(`.tools`)
      .previousElementSibling.querySelector(
        `.userSide__post__username`
      ).innerHTML;
    // username
    const parentComment = toolReplayBtn.closest(`.comment`);
    console.log(parentComment);
    const parentCommentId = toolReplayBtn.closest(`.comment`).id;
    const parentToReplayCont =
      toolReplayBtn.closest(`.comment`)?.nextElementSibling;
    // აქ ვამოწმებ ერთხელ მაინც თუ ჩავამატე რო ღილაკს რო დავაჭერ ბევრჯერ არ ჩამიმატოს
    if (!parentToReplayCont.innerHTML.includes(`userComment`)) {
      renderCurrentUserCommentingSection(
        currentUserPictureWebp,
        parentToReplayCont,
        e.target.innerHTML
      );
    }

    addingRepliesAndRendering(
      storage,
      parentCommentId,
      parentComment,
      userName
    );
  }
};

// ! MODAL \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const modal = document.getElementById(`modal`);
export const modalCancelBtn = document.getElementById(`cancelModalBtn`);
const modalDeleteBtn = document.getElementById(`deleteModalBtn`);

const openModal = function () {
  modal.classList.remove(`hidden`);
};

export const closeModal = function () {
  modal.classList.add(`hidden`);
};

//!  DELETE \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

const newStorageMaker = (objToFilter, commentId) =>
  objToFilter.filter((comment) => comment.id != commentId);

const overwriteStorage = () => {
  updateStorage(STORAGE_KEY, storage);
  updateUI(commentSectionContainer, storage, currentUserUsername);
  closeModal();
};
const deleteFuncForModal = (commentId) => {
  const newStorage = newStorageMaker(storage, commentId);
  if (newStorage.length === storage.length) {
    for (let comments of storage) {
      let replays = comments.replies;
      comments.replies = newStorageMaker(replays, commentId);
    }
  }
  storage = newStorage;
  overwriteStorage();
};

export const deleteFunc = (e) => {
  if (e.target.innerHTML === `Delete`) {
    const commentId = e.target.closest(`.comment`).id;
    /// functionality
    openModal();
    modalDeleteBtn.addEventListener(`click`, () =>
      deleteFuncForModal(commentId)
    );
  }
};

//! Edit \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const includesOrNot = (commentId) =>
  storage.filter((comment) => comment.id === commentId)[0];

const inputChanger = (whereToChange, commentId) =>
  whereToChange.forEach((comment) =>
    comment.id == commentId
      ? (comment.content = userUpdateInput.value)
      : comment
  );

const editFuncForUpdateBtn = (commentId) => {
  if (!includesOrNot(commentId)) {
    for (let comments of storage) {
      let replays = comments.replies;
      inputChanger(replays, commentId);
    }
  }
  inputChanger(storage, commentId);
  updateStorage(STORAGE_KEY, storage);
  updateUI(commentSectionContainer, storage, currentUserUsername);
};

export const editFunc = (e) => {
  if (e.target.innerHTML === `Edit` && e.target.closest(`.comment`)) {
    const comment = e.target.closest(`.comment`);
    const commentId = Number(e.target.closest(`.comment`).id);

    const commentTextContainer = comment.querySelector(
      `.comment__content__bottomRow`
    );

    /// ganuleba da gamochena
    commentTextContainer.innerHTML = ``;
    renderCurrentUserCommentingSection(
      currentUserPictureWebp,
      commentTextContainer,
      e.target.innerHTML
    );
    const updateBtn = document.getElementById(`userUptadeBtn`);
    const userUpdateInput = document.getElementById(`userUpdateInput`);
    /// event
    updateBtn.addEventListener(`click`, () => editFuncForUpdateBtn(commentId));
  }
};

//! Votes \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const scoreChanger = (whereToChange, commentId, type) =>
  whereToChange.forEach((comment) => {
    if (comment.id === commentId) {
      if (type === `+`) {
        comment.score++;
      }
      if (type === `-` && comment.score > 0) {
        comment.score--;
      }
    }
  });

const votingFunctionForButtons = (commentId, targetValue) => {
  if (!includesOrNot(commentId)) {
    for (let comments of storage) {
      let replays = comments.replies;
      console.log(replays);
      scoreChanger(replays, commentId, targetValue);
    }
  }
  scoreChanger(storage, commentId, targetValue);
  updateStorage(STORAGE_KEY, storage);
  updateUI(commentSectionContainer, storage, currentUserUsername);
};
export const upVotedownVote = (e) => {
  const targetValue = e.target.innerHTML;
  const commentId = Number(e.target.closest(`.comment`).id);
  if (targetValue === `+` || targetValue === `-`) {
    const plus = e.target;
    e.target.addEventListener(`click`, () =>
      votingFunctionForButtons(commentId, targetValue)
    );
  }
};
