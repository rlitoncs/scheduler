import React from "react";

import { render, fireEvent, cleanup, getByText, getAllByTestId, findByText, getByAltText, queryByText, prettyDOM, getByPlaceholderText } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);


describe("Application", () => {
  it("renders without crashing", () => {
    render(<Application />);
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />) // container represents the DOM tree that we are working with
    
    await findByText(container, "Archie Cohen");

    // console.log(prettyDOM(container));

    const appointments = getAllByTestId(container, "appointment"); // returns an array

    // console.log(prettyDOM(appointments));
    const appointment = appointments[0];

    // console.log(prettyDOM(appointment));

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones"}
    })


    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));


    // expect(getByText(appointment, /Saving/i)).toBeInTheDocument();
    // console.log(prettyDOM(appointment));

    await findByText(appointment, "Lydia Miller-Jones");  

    // debug(appointment);

    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"))
    // debug(day);

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();



  })
})

