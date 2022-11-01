import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithProvider } from "./test-utils";

describe("GameList 컴포넌트", () => {
  it("GameList 컴포넌트 렌더링시 element 렌더 정상여부체크", () => {
    renderWithProvider(["/game_list"]);

    expect(
      screen.getByText(/도전하고 싶은 맵을 선택하세요./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/stage1/i)).toBeInTheDocument();
  });

  it("맵 클릭시 게임 페이지로 이동", async () => {
    const user = userEvent.setup();

    renderWithProvider(["/game_list"]);

    await user.click(screen.getByText(/stage1/i));

    expect(screen.getByText(/코드 블록 선택하기/i)).toBeInTheDocument();
    expect(screen.getByText(/코드 블록 놓기/i)).toBeInTheDocument();
    expect(screen.getByText(/앞으로 1칸 이동/i)).toBeInTheDocument();
    expect(screen.getByText(/오른쪽으로 회전하기/i)).toBeInTheDocument();
    expect(screen.getByText(/왼쪽으로 회전하기/i)).toBeInTheDocument();
    expect(screen.getByText(/공격하기/i)).toBeInTheDocument();
    expect(screen.getByText(/만약/i)).toBeInTheDocument();
    expect(screen.getByText(/계속 반복하기/i)).toBeInTheDocument();
    expect(screen.getByText("🔁 반복하기")).toBeInTheDocument();
  });
});
