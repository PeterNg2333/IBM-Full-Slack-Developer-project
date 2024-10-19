import { Component } from "react";

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      like: 0,
      dislike: 0,
      handleLike: () => {
        alert("Liked");
        this.setState((prevState) => ({like: prevState.like + 1}));
        return;
      },
  
      handleDislike: () => {
        alert("Disliked");
        this.setState((prevState) => ({dislike: prevState.dislike + 1}));
        return;
      }
    };


  }

  render() {
    return (
      <div>
        <h1>Do you like this content?</h1>
        <button onClick={this.state.handleLike}>
          Like: {this.state.like}
        </button>
        <button onClick={this.state.handleDislike}>
          Dislike: {this.state.dislike}
        </button>
      </div>
    );
  }

}

export default App;
