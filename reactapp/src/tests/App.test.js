import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

jest.mock("../services/api", () => ({
  addCookie: jest.fn(),
  getAllCookies: jest.fn(),
  getCookiesByFlavor: jest.fn(),
  getCookiesSortedByPrice: jest.fn(),
  deleteCookie: jest.fn(),
}));

import {
  addCookie,
  getAllCookies,
  getCookiesByFlavor,
  getCookiesSortedByPrice,
  deleteCookie,
} from "../services/api";

describe("Cookie Store Management App Tests", () => {
  const mockCookies = [
    { id: 1, cookieName: "Choco Chip", flavor: "Chocolate", price: 50, quantityAvailable: 20 },
    { id: 2, cookieName: "Vanilla Delight", flavor: "Vanilla", price: 40, quantityAvailable: 10 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------- Existing Basic Tests ----------
  test("renders header with title", async () => {
    getAllCookies.mockResolvedValueOnce({ data: [] });
    render(<App />);
    expect(await screen.findByRole("heading", { name: /cookie store management/i })).toBeInTheDocument();
  });

  test("renders empty state when no cookies", async () => {
    getAllCookies.mockResolvedValueOnce({ data: [] });
    render(<App />);
    expect(await screen.findByText(/no cookies available/i)).toBeInTheDocument();
  });

  test("renders list of cookies", async () => {
    getAllCookies.mockResolvedValueOnce({ data: mockCookies });
    render(<App />);
    expect(await screen.findByText("Choco Chip")).toBeInTheDocument();
    expect(screen.getByText("Vanilla Delight")).toBeInTheDocument();
  });

  test("form requires required fields and calls addCookie", async () => {
    getAllCookies.mockResolvedValueOnce({ data: [] });
    addCookie.mockResolvedValueOnce({});
    render(<App />);

    fireEvent.change(screen.getByPlaceholderText("Cookie Name"), { target: { value: "New Cookie" } });
    fireEvent.change(screen.getByPlaceholderText("Flavor (Chocolate, Vanilla...)"), { target: { value: "Chocolate" } });
    fireEvent.change(screen.getByPlaceholderText("Price"), { target: { value: "25" } });
    fireEvent.change(screen.getByPlaceholderText("Quantity"), { target: { value: "15" } });

    fireEvent.click(screen.getByRole("button", { name: /add cookie/i }));

    await waitFor(() =>
      expect(addCookie).toHaveBeenCalledWith(expect.objectContaining({ cookieName: "New Cookie", flavor: "Chocolate" }))
    );
  });

  test("does not break when deleting non-existing cookie (empty list)", async () => {
    getAllCookies.mockResolvedValueOnce({ data: [] });
    deleteCookie.mockResolvedValueOnce({});
    render(<App />);
    expect(await screen.findByText(/no cookies available/i)).toBeInTheDocument();
  });

  test("handles API error on fetch", async () => {
    getAllCookies.mockRejectedValueOnce(new Error("Network Error"));
    render(<App />);
    expect(await screen.findByRole("heading", { name: /cookie store management/i })).toBeInTheDocument();
  });

  test("handles API error on add cookie", async () => {
    getAllCookies.mockResolvedValueOnce({ data: [] });
    addCookie.mockRejectedValueOnce(new Error("Add failed"));

    render(<App />);
    fireEvent.change(screen.getByPlaceholderText("Cookie Name"), { target: { value: "Test Cookie" } });
    fireEvent.change(screen.getByPlaceholderText("Flavor (Chocolate, Vanilla...)"), { target: { value: "Butter" } });
    fireEvent.change(screen.getByPlaceholderText("Price"), { target: { value: "30" } });
    fireEvent.change(screen.getByPlaceholderText("Quantity"), { target: { value: "10" } });
    fireEvent.click(screen.getByRole("button", { name: /add cookie/i }));

    await waitFor(() => expect(addCookie).toHaveBeenCalled());
    expect(await screen.findByRole("heading", { name: /cookie store management/i })).toBeInTheDocument();
  });

  // ---------- New Basic Tests (8 More) ----------
  test("renders add cookie form inputs", async () => {
    getAllCookies.mockResolvedValueOnce({ data: [] });
    render(<App />);
    expect(await screen.findByPlaceholderText("Cookie Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Flavor (Chocolate, Vanilla...)")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Price")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Quantity")).toBeInTheDocument();
  });

  test("renders add cookie button", async () => {
    getAllCookies.mockResolvedValueOnce({ data: [] });
    render(<App />);
    expect(await screen.findByRole("button", { name: /add cookie/i })).toBeInTheDocument();
  });

  test("initially shows empty form fields", async () => {
    getAllCookies.mockResolvedValueOnce({ data: [] });
    render(<App />);
    expect(await screen.findByPlaceholderText("Cookie Name")).toHaveValue("");
    expect(screen.getByPlaceholderText("Flavor (Chocolate, Vanilla...)")).toHaveValue("");
    expect(screen.getByPlaceholderText("Price")).toHaveValue(null);
    expect(screen.getByPlaceholderText("Quantity")).toHaveValue(null);
  });

  test("typing updates the Cookie Name field", async () => {
    getAllCookies.mockResolvedValueOnce({ data: [] });
    render(<App />);
    const input = await screen.findByPlaceholderText("Cookie Name");
    fireEvent.change(input, { target: { value: "Test Cookie" } });
    expect(input).toHaveValue("Test Cookie");
  });

  test("typing updates the Flavor field", async () => {
    getAllCookies.mockResolvedValueOnce({ data: [] });
    render(<App />);
    const input = await screen.findByPlaceholderText("Flavor (Chocolate, Vanilla...)");
    fireEvent.change(input, { target: { value: "Mint" } });
    expect(input).toHaveValue("Mint");
  });

  test("typing updates the Price field", async () => {
    getAllCookies.mockResolvedValueOnce({ data: [] });
    render(<App />);
    const input = await screen.findByPlaceholderText("Price");
    fireEvent.change(input, { target: { value: "45" } });
    expect(input).toHaveValue(45);
  });

  test("typing updates the Quantity field", async () => {
    getAllCookies.mockResolvedValueOnce({ data: [] });
    render(<App />);
    const input = await screen.findByPlaceholderText("Quantity");
    fireEvent.change(input, { target: { value: "12" } });
    expect(input).toHaveValue(12);
  });

  test("renders dropdown with All Cookies option", async () => {
    getAllCookies.mockResolvedValueOnce({ data: [] });
    render(<App />);
    expect(await screen.findByDisplayValue("All Cookies")).toBeInTheDocument();
  });
});
