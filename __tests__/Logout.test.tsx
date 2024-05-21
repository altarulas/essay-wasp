import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Logout } from "@/components/core/Logout/Logout";
import { supabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock supabaseClient
jest.mock("@/utils/supabase/client", () => ({
  supabaseClient: jest.fn(() => ({
    auth: {
      signOut: jest.fn(),
    },
  })),
}));

describe("Logout Component", () => {
  const mockPush = jest.fn();
  const mockSignOut = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (supabaseClient as jest.Mock).mockReturnValue({
      auth: {
        signOut: mockSignOut,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should render logout button", () => {
    render(<Logout />);

    const button = screen.getByTestId("logout-button");
    expect(button).toBeInTheDocument();

    const buttonText = screen.getByText(/Logout/i);
    expect(buttonText).toBeInTheDocument();
  });

  test("should render loading and navigate home page when is clicked", async () => {
    render(<Logout />);

    const button = screen.getByTestId("logout-button");
    fireEvent.click(button);

    const loadingDialog = screen.getByTestId("loading-icon");
    expect(loadingDialog).toBeInTheDocument();

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });
});
