import React from "react";
import "./Joke.css";

class JokeClass extends React.Component {
  upVote = () => this.props.vote(this.props.id, +1);
  downVote = () => this.props.vote(this.props.id, -1);
  toggleLock = () => this.props.toggleLock(this.props.id);

  render() {
    return (
      <div className="Joke">
        <div className="Joke-votearea">
          <button onClick={this.upVote}>
            <i className="fas fa-thumbs-up click" />
          </button>

          <button onClick={this.downVote}>
            <i className="fas fa-thumbs-down click" />
          </button>
          <button onClick={this.toggleLock}>
            <i
              className={`fas ${this.props.locked ? "fa-unlock" : "fa-lock"}`}
            />
          </button>
          {this.props.votes}
        </div>

        <div className="Joke-text">{this.props.text}</div>
      </div>
    );
  }
}

export default JokeClass;
