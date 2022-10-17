import React from "react";
import { Link } from "react-router-dom";

export default class Header extends React.Component {
  state = {
    inputValue: "",
  };

  handleSubmitForm = (event) => {
    this.setState({ inputValue: "" });
  };
  /*
   * This method handles submit, only cleans up the input.
   */

  handleChangeInput = (event) => {
    let value = event.target.value;

    console.log(value);

    this.setState({ inputValue: value });
    this.props.getInputForm(value);
  };
  /*
   * This method handles the change of the input, every time there is a change in the input it sends
   * the value of the input to the APP component so that it can use it in its search for movies.
   */

  render = () => (
    <header className="header">
      <Link to="/">
        <img
          src="https://fontmeme.com/permalink/190707/fd4735271a0d997cbe19a04408c896fc.png"
          alt="netflix-font"
          border="0"
        />
      </Link>
      <div id="navigation" className="navigation">
        <nav>
          <ul>
            <li>
              <Link to="/my-list">My List</Link>
            </li>
          </ul>
        </nav>
      </div>
      <form id="search" className="search" onSubmit={this.handleSubmitForm}>
        <input
          type="search"
          placeholder="Search for a title..."
          value={this.state.inputValue}
          onChange={this.handleChangeInput}
        />
        <div className="searchResults">
          {this.props.moviesFound > 0 || this.state.inputValue.length > 0
            ? `Found ${this.props.moviesFound} movies with the query "${this.state.inputValue}"`
            : ""}
        </div>
      </form>
    </header>
  );
}
