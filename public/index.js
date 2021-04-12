class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total_amount: 1000,
    };
  }
  render() {
    return (
      <div>
        <h1>Lottery Web 2.0</h1>
        <div>
          <p>Total Lottery Amount is {this.state.total_amount}</p>
        </div>
        <form action="">
          <input type="text" placeholder="amount" />
          <input type="text" placeholder="email" />
          <button>Participate</button>
        </form>
      </div>
    );
  }
}

ReactDOM.render(
  <div>
    <App />
  </div>,
  document.getElementById('reactBinding')
);
