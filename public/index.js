class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h1>Lottery Web 2.0</h1>
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
