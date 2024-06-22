import { Login } from "@/components/core/Login/Login";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { supabaseClient } from "@/utils/supabase/client";

jest.mock("@/utils/supabase/client", () => ({
  supabaseClient: jest.fn().mockReturnValue({
    auth: {
      signInWithOAuth: jest.fn(),
    },
  }),
}));

describe("Login Component", () => {
  test("should render login button with google icon and text", () => {
    render(<Login />);

    const button = screen.getByTestId("login-button");
    expect(button).toBeInTheDocument();

    const googleIcon = screen.getByTestId("google-icon");
    expect(googleIcon).toBeInTheDocument();

    const buttonText = screen.getByText(/Sign in with Google/i);
    expect(buttonText).toBeInTheDocument();
  });

  test("calls handleGoogleLogin when button is clicked", () => {
    const mockSupabase = supabaseClient().auth.signInWithOAuth;

    render(<Login />);

    const button = screen.getByTestId("login-button");
    fireEvent.click(button);

    expect(mockSupabase).toHaveBeenCalledTimes(1);
    expect(mockSupabase).toHaveBeenCalledWith({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  });
});
