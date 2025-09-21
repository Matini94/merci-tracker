import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DateRangeSelector from "../DateRangeSelector";

// [AI]
describe("DateRangeSelector", () => {
  const mockOnRangeChange = jest.fn();
  const defaultProps = {
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    onRangeChange: mockOnRangeChange,
  };

  beforeEach(() => {
    mockOnRangeChange.mockClear();
  });

  it("renders date range selector with correct initial values", () => {
    render(<DateRangeSelector {...defaultProps} />);

    expect(screen.getByText("Date Range")).toBeInTheDocument();
    expect(screen.getByText("Jan 1, 2024 → Jan 31, 2024")).toBeInTheDocument();
  });

  it("displays preset range buttons", () => {
    render(<DateRangeSelector {...defaultProps} />);

    expect(screen.getByText("Last 7 days")).toBeInTheDocument();
    expect(screen.getByText("Last 30 days")).toBeInTheDocument();
    expect(screen.getByText("Last 90 days")).toBeInTheDocument();
    expect(screen.getByText("Last year")).toBeInTheDocument();
    expect(screen.getByText("This month")).toBeInTheDocument();
    expect(screen.getByText("This year")).toBeInTheDocument();
    expect(screen.getByText("Custom Range")).toBeInTheDocument();
  });

  it("calls onRangeChange when preset button is clicked", () => {
    render(<DateRangeSelector {...defaultProps} />);

    fireEvent.click(screen.getByText("Last 7 days"));

    expect(mockOnRangeChange).toHaveBeenCalledWith(
      expect.objectContaining({
        start: expect.any(String),
        end: expect.any(String),
      })
    );
  });

  it("shows custom date inputs when Custom Range is clicked", () => {
    render(<DateRangeSelector {...defaultProps} />);

    fireEvent.click(screen.getByText("Custom Range"));

    expect(screen.getByLabelText("Start Date")).toBeInTheDocument();
    expect(screen.getByLabelText("End Date")).toBeInTheDocument();
  });

  it("calls onRangeChange when custom date is changed", () => {
    render(<DateRangeSelector {...defaultProps} />);

    fireEvent.click(screen.getByText("Custom Range"));

    const startDateInput = screen.getByLabelText("Start Date");
    fireEvent.change(startDateInput, { target: { value: "2024-01-15" } });

    expect(mockOnRangeChange).toHaveBeenCalledWith({
      start: "2024-01-15",
      end: "2024-01-31",
    });
  });

  it("validates date range in custom inputs", () => {
    render(<DateRangeSelector {...defaultProps} />);

    fireEvent.click(screen.getByText("Custom Range"));

    const startDateInput = screen.getByLabelText("Start Date");
    const endDateInput = screen.getByLabelText("End Date");

    // Start date should have max attribute set to end date
    expect(startDateInput).toHaveAttribute("max", defaultProps.endDate);
    // End date should have min attribute set to start date
    expect(endDateInput).toHaveAttribute("min", defaultProps.startDate);
  });
});
// [/AI]
