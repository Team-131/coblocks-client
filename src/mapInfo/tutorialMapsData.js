import { BLOCK_NAMES } from "../config/constants";

const { MOVE, TURN_RIGHT, TURN_LEFT, ATTACK, IF, WHILE, REPEAT } = BLOCK_NAMES;

const tutorialMapsData = {
  stage1: {
    tip: "어느 방향일까?: 앞으로! 오른쪽으로! 왼쪽으로!",
    defaultField: 1,
    startingPoint: 45,
    blocks: [MOVE, TURN_RIGHT, TURN_LEFT],
    limitCount: 10,
    elements: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 21, 21, 21, 11, 11, 21, 21, 21, 21, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 10, 10,
      10, 10, 10, 10, 10, 10, 10, 10, 20, 20, 20, 20, 20, 20, 20, 20, 20, 11, 0,
      0, 0, 0, 0, 0, 0, 0, 20, 11, 0, 0, 0, 0, 0, 0, 0, 0, 20, 11, 0, 0, 0, 0,
      0, 0, 0, 0, 20, 60, 0, 0, 0, 0, 0, 0, 0, 0, 20, 20,
    ],
  },
  stage2: {
    tip: "공격하기: 애벌레를 잡아보자!",
    defaultField: 0,
    startingPoint: 52,
    blocks: [MOVE, ATTACK],
    limitCount: 10,
    elements: [
      30, 30, 30, 30, -1, -1, 30, 30, 30, 30, 21, 21, 21, 21, 11, 11, 21, 21,
      21, 21, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 20,
      20, 20, 20, 20, 20, 20, 20, 20, 20, -1, -1, -1, -1, -1, 80, -1, 60, -1,
      -1, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 99, -1, 99, -1, 99, -1, 99, -1,
      99, -1,
    ],
  },
  stage3: {
    tip: "몇 번 반복하기: 같은 행동을 몇 번 반복하자! (직접 반복 횟수를 정해주세요)",
    defaultField: 0,
    startingPoint: 40,
    blocks: [MOVE, TURN_RIGHT, TURN_LEFT, REPEAT],
    limitCount: 7,
    elements: [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, 20, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      60,
    ],
  },
  stage4: {
    tip: "계속 반복하기: 같은 행동을 계속 계속 반복하자!",
    defaultField: 0,
    startingPoint: 90,
    blocks: [MOVE, TURN_RIGHT, TURN_LEFT, WHILE],
    limitCount: 7,
    elements: [
      -1, -1, -1, -1, 10, -1, -1, -1, -1, -1, -1, -1, 20, -1, 21, -1, -1, -1,
      -1, 60, 21, 11, 21, 21, 21, 21, 21, 21, 11, 21, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, 21, 11, 21, 21, 21, 21, 11, 21, 21, 21, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, 21, 21, 21, 21, 11, 21, 21, 21, 21, 21, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, 21, 21, 11, 21, 21, 21, 21, 11, 21, 21,
      -1, -1, -1, -1, -1, 20, -1, -1, -1, -1,
    ],
  },
  stage5: {
    tip: "만약: 오른쪽으로 갈 수 있다면? 왼쪽으로 갈 수 있다면?",
    defaultField: 0,
    startingPoint: 84,
    blocks: [MOVE, IF, WHILE],
    limitCount: 4,
    elements: [
      20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, -1, -1, 20, 20, -1, -1,
      20, 20, 20, -1, -1, -1, -1, -1, -1, -1, -1, 20, -1, -1, 20, 20, 60, 60,
      20, 20, -1, -1, -1, -1, 20, 20, 20, 20, 20, 20, -1, -1, 20, -1, -1, 20,
      20, 20, 20, -1, -1, 20, 20, 20, -1, -1, 20, 20, -1, -1, 20, 20, 20, 20,
      20, -1, -1, -1, -1, 20, 20, 20, 20, 20, 20, 20, -1, -1, 20, 20, 20, 20,
      20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
    ],
  },
};

export { tutorialMapsData };
