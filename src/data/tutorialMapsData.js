const tutoriaMapsData = {
  stage1: {
    tip: "1칸 전진 블록을 사용해서 목적지에 도착 해 보세요.",
    defaultField: 1,
    startingPoint: 50,
    blocks: ["1칸전진"],
    limitCount: 10,
    elements: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 21, 21, 21, 11, 21, 21, 21, 21, 21, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 20, 20, 20,
      20, 20, 20, 20, 20, 20, 10, 10, 10, 10, 10, 10, 10, 10, 10, 60, 20, 20,
      20, 20, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
  },
  stage2: {
    tip: "1칸 전진과 while을 사용해서 목적지에 도착 해 보세요.",
    defaultField: 0,
    startingPoint: 50,
    blocks: ["1칸전진", "while"],
    limitCount: 2,
    elements: [
      30, 30, 30, 30, -1, 30, 30, 30, 30, 30, 21, 21, 21, 21, 11, 21, 21, 21,
      21, 21, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 20,
      20, 20, 20, 20, 20, 20, 20, 20, 20, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      60, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      80, -1, 80, -1, 80, -1, 80, -1, 80, -1, 90, -1, 90, -1, 90, -1, 90, -1,
      90, -1,
    ],
  },
  stage3: {
    tip: "회전 블럭을 사용해 보세요.",
    defaultField: 0,
    startingPoint: 90,
    blocks: ["1칸전진", "while", "오른쪽회전", "왼쪽회전"],
    limitCount: 10,
    elements: [
      21, 21, 21, 21, 21, 21, 21, 21, 1, 60, 21, 21, 21, 21, 21, 21, 21, 21, 1,
      1, 40, 20, -1, -1, 21, 21, 21, 21, 11, 21, 20, 20, -1, -1, 10, 10, 10, -1,
      -1, 21, -1, -1, -1, -1, 21, 21, 21, -1, -1, 21, 21, 21, 11, 21, 21, 21,
      21, 11, 21, 21, 21, 21, 11, 21, 21, 21, 21, 11, 21, 21, 21, 21, 11, 21,
      21, 21, 21, 11, 21, 21, 21, 21, 11, 21, 21, 21, 21, 11, 21, 21, -1, -1,
      -1, -1, 10, 10, -1, -1, -1, -1,
    ],
  },
  stage4: {
    tip: "1칸전진, 회전을 반복문에 넣어서 사용해 보세요.",
    defaultField: 0,
    startingPoint: 90,
    blocks: ["1칸전진", "while", "오른쪽회전", "왼쪽회전"],
    limitCount: 6,
    elements: [
      -1, -1, -1, -1, 10, -1, -1, -1, -1, -1, -1, -1, 20, -1, 21, -1, -1, -1,
      -1, 50, 21, 11, 21, 21, 21, 21, 21, 21, 11, 21, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, 21, 11, 21, 21, 21, 21, 11, 21, 21, 21, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, 21, 21, 21, 21, 11, 21, 21, 21, 21, 21, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, 21, 21, 11, 21, 21, 21, 21, 11, 21, 21,
      -1, -1, -1, -1, -1, 20, -1, -1, -1, -1,
    ],
  },
  stage5: {
    tip: "열쇠를 얻어야 문을 열 수 있습니다.",
    defaultField: 0,
    startingPoint: 90,
    blocks: ["1칸전진", "while", "오른쪽회전", "왼쪽회전"],
    limitCount: 10,
    elements: [
      80, 80, 80, 21, 21, 21, 21, -1, -1, 60, 90, 90, 90, 21, 21, 21, 21, -1,
      -1, -1, 80, 80, 80, 21, 21, 21, 21, -1, -1, -1, 90, 90, 90, 21, 21, 21,
      21, -1, -1, -1, 1, 1, 1, 10, 10, 10, 10, -1, -1, -1, 21, 21, 21, 21, 21,
      21, 21, -1, -1, -1, 21, 21, 21, 21, 21, 21, 21, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, 20, 20, 20, 20, 20, 20, 20, 50, 20, 20, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, 40,
    ],
  },
  stage6: {
    tip: "공격을 하면 몬스터를 사라지게 할 수 있습니다.",
    defaultField: 1,
    startingPoint: 90,
    blocks: ["1칸전진", "while", "오른쪽회전", "왼쪽회전", "공격"],
    limitCount: 10,
    elements: [
      80, 80, 80, 21, 21, 21, 21, -1, -1, 60, 90, 90, 90, 21, 21, 21, 21, -1,
      -1, -1, 80, 80, 80, 21, 21, 21, 21, -1, -1, -1, 90, 90, 90, 21, 21, 21,
      21, -1, -1, -1, 1, 1, 1, 10, 10, 10, 10, -1, -1, -1, 21, 21, 21, 21, 21,
      21, 21, -1, -1, -1, 21, 21, 21, 21, 21, 21, 21, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, 20, 20, 20, 20, 20, 20, 20, 50, 20, 20, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, 40,
    ],
  },
  stage7: {
    tip: "if를 사용해서 목적지에 도달해 보세요.",
    defaultField: 0,
    startingPoint: 90,
    blocks: ["1칸전진", "while", "오른쪽회전", "왼쪽회전", "if"],
    limitCount: 6,
    elements: [
      20, 20, 20, 20, 20, 20, 20, 20, 20, 60, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, 21, 11, 21, 21, 21, 21, 21, 21, 21, 21, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, 20, 21, 21, 21, 21, 21, 21, 21, 21, 11, 21, -1, -1, -1, -1,
      -1, 20, 21, 20, -1, 20, -1, 20, 20, 20, -1, 20, 21, 20, -1, 20, -1, -1,
      -1, 20, -1, 20, 20, 20, -1, 20, 20, 20, -1, 20, -1, -1, -1, -1, -1, 20,
      -1, -1, -1, 20, 20, 20, 20, 20, 20, 20,
    ],
  },
};

export { tutoriaMapsData };