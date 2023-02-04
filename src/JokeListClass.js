import React from "react";
import axios from "axios";
import JokeClass from "./JokeClass";
import "./JokeList.css";

class JokeListClass extends React.Component {
  static defaultProps = {
    numJokesToGet: 10,
  };

  state = {
    jokes: [],
  };
  componentDidMount() {
    this.getJokes();
  }

  componentDidUpdate() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }

  getJokes = async () => {
    let seenJokes = new Set();
    let jokeVotes = JSON.parse(
      window.localStorage.getItem("jokeVotes") || "[]"
    );
    let j = [...jokeVotes, ...this.state.jokes];
    try {
      while (j.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" },
        });
        let { status, ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0, locked: false });
        } else {
          console.error("duplicate found!");
        }
      }
      this.setState({ jokes: j });
    } catch (e) {
      console.log(e);
    }
  };

  resetVotes = () => {
    window.localStorage.setItem("jokeVotes", "[]");
    this.setState((prev) => ({
      jokes: prev.jokes.map((j) => ({ ...j, votes: 0 })),
    }));
  };

  generateNewJokes = () => {
    this.setState((prev) => ({
      jokes: prev.jokes.filter((j) => j.locked),
    }));
  };

  vote = (id, delta) => {
    this.setState((prev) => ({
      jokes: prev.jokes.map((j) =>
        j.id === id ? { ...j, votes: j.votes + delta } : j
      ),
    }));
    this.addToLs(id, delta)
  };

addToLs = (id, delta) => {
  let jokeVotes = JSON.parse(window.localStorage.getItem("jokeVotes"));
  let foundJoke = jokeVotes.find(j => j.id === id )
  if (!foundJoke){
    foundJoke = structuredClone(this.state.jokes.find(j => j.id === id))
    jokeVotes.push(foundJoke)
  }
  foundJoke.votes = foundJoke.votes + delta
  if (foundJoke.votes === 0){
    jokeVotes = jokeVotes.filter(j => j.id !== id)
  } 
  window.localStorage.setItem("jokeVotes", JSON.stringify(jokeVotes));
}

  toggleLock = (id) => {
    this.setState((prev) => ({
      jokes: prev.jokes.map((j) =>
        j.id === id ? { ...j, locked: !j.locked } : j
      ),
    }));
  };

  render() {
    let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);

    return (
      <>
        <div className="JokeList">
          <div>
            <button
              className="JokeList-getmore click"
              onClick={this.generateNewJokes}
            >
              Get New Jokes
            </button>
            <button
              className="JokeList-getmore click ms-3"
              onClick={this.resetVotes}
            >
              Reset Votes
            </button>
          </div>

          {sortedJokes.map((j) => (
            <JokeClass
              text={j.joke}
              key={j.id}
              id={j.id}
              votes={j.votes}
              vote={this.vote}
              locked={j.locked}
              toggleLock={this.toggleLock}
            />
          ))}
        </div>
        {sortedJokes.length < this.props.numJokesToGet ? (
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : null}
      </>
    );
  }
}

export default JokeListClass;
