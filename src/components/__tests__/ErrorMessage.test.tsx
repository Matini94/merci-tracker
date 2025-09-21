// [AI]
import React from "react";
import { render, screen } from "@testing-library/react";
import ErrorMessage from "../ui/ErrorMessage";

describe("ErrorMessage", () => {
  test("renders error message correctly", () => {
    const message = "Something went wrong";
    render(<ErrorMessage message={message} />);

    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  test("applies custom className", () => {
    const customClass = "custom-error";
    const { container } = render(
      <ErrorMessage message="Error" className={customClass} />
    );

    expect(container.firstChild).toHaveClass(customClass);
  });

  test("has proper ARIA attributes", () => {
    render(<ErrorMessage message="Error occurred" />);

    const errorContainer = screen.getByRole("alert");
    expect(errorContainer).toHaveAttribute("aria-live", "polite");
  });

  test("displays error icon", () => {
    render(<ErrorMessage message="Error occurred" />);

    const icon = screen.getByRole("alert").querySelector("svg");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });
});
// [/AI]
