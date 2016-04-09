var App = React.createClass({ //Main parent component
  getInitialState: function() {
    return {
      list: [
        {
          label: "0x",
          color: "red",
          order: 0
        },
        {
          label: "1x",
          color: "orange",
          order: 1
        },
        {
          label: "2x",
          color: "yellow",
          order: 2
        },
        {
          label: "3x",
          color: "green",
          order: 3
        },
        {
          label: "4x",
          color: "blue",
          order: 4
        },
        {
          label: "5x",
          color: "purple",
          order: 5
        },
        {
          label: "6x",
          color: "grey",
          order: 6
        },
      ],
      currentDragIndex: 0,
      currentDropLocation: 0,
      dragging: false
    }
  },
  setDropIndex: function(index) { // Store index you're dropping over
    // Fire when dropping an object
    // console.log("Dropping object over", index); // Feedback
    // console.log("Dragging: false")
    this.setState({
      currentDropLocation: index, // Store
      dragging: false
    })

    // Logic to reorder list
    var originalIndex = this.state.currentDragIndex;
    var desiredIndex = index;
    // console.log("Reordering list. Moving", originalIndex, "to", desiredIndex);
    var list = this.state.list;
    var updatedList = this.state.list;

    for (var i = 0; i < list.length; i++) {
      if (originalIndex < desiredIndex) { // If moving an object higher on the list
        // console.log("Checking", list[i].label); // Debugging
        if (list[i].order == originalIndex) {
          // console.log("Changing", list[i].label, "index to", desiredIndex) // Debugging
          updatedList[i].order = desiredIndex; // Change order of original object
        } else if (list[i].order > originalIndex && list[i].order <= desiredIndex) {// If between the two
          var newIndex = updatedList[i].order - 1;
          // console.log("Changing", list[i].label, "index to", newIndex) // Debugging
          updatedList[i].order = newIndex;
        }
      } else { // If moving an item lower on the list
        // console.log("Checking", list[i].label); // Debugging
        if (list[i].order == originalIndex) {
          // console.log("Changing", list[i].label, "index to", desiredIndex) // Debugging
          updatedList[i].order = desiredIndex; // Change order of original object
        } else if (list[i].order < originalIndex && list[i].order >= desiredIndex) {// If between the two
          var newIndex = updatedList[i].order + 1;
          // console.log("Changing", list[i].label, "index to", newIndex) // Debugging
          updatedList[i].order = newIndex;
        }
      }
    }

    // console.log(updatedList); // Debugging
    this.setState({ // Update state
      list: updatedList
    })
  },
  setDragObject: function(index) { // Store index of what you're dropping
    // console.log("Dragging object", index);
    // console.log("Dragging: true"); // Debugging
    this.setState({
      currentDragIndex: index, // Store
      dragging: true
    })
  },
  render: function() {
    var data = this.state.list;
    var maxElements = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i].order > maxElements) {
        maxElements = data[i].order; // Set the size of the array
      }
    }
    maxElements += 1; // Because index starts at 0
    var sortedArray = [];
    for (var i = 0; i < maxElements; i++) { // Create empty object
      sortedArray.push({}); // Push empty object
    }
    for (var i = 0; i < data.length; i++) {
      desiredPlace = data[i].order;
      sortedArray[desiredPlace] = data[i];
    } // sortedArray now in order
    var setDropIndex = this.setDropIndex; // Must keep this outside of the mapping because of scope
    var setDragObject = this.setDragObject; // Set which object is being dragged
    var dragging = this.state.dragging; // Store outside of mapping because of scope

    var listNodes = sortedArray.map(function(listItem) {
      return (
        <ListElement data={listItem} setDropIndex={setDropIndex} setDragObject={setDragObject} dragging={dragging}/>
      );
    })
    return (
      <div>
        <h2>Drag and Drop Interface</h2>
        {listNodes}
      </div>
    );
  }
});

var ListElement = React.createClass({
  onDragStart: function(ev) {
    ev.preventDefault(); // Allow dropping
    // console.log("Dragging", this.props.data.label)
    this.props.setDragObject(this.props.data.order); // Pass in the index that you're dragging
  },
  onDragOver: function(ev) { // If something is being dragged over it
    ev.preventDefault(); // Allow dropping
    // console.log("Dragging over", this.props.data.label); // Feedback
    return false
  },
  onDrop: function(ev) {
    ev.preventDefault(); // Allow dropping
    // console.log("Dropped onto element", this.props.data.label);
    this.props.setDropIndex(this.props.data.order); // Pass in the index of the object you're dropping over
  },
  render: function() {
    var backgroundColor = {"backgroundColor": this.props.data.color}
    var cursorClass = this.props.dragging ? "draggingCursor" : "";
    console.log("Dragging class:", cursorClass)
    return (
      <div className={"list-block " + cursorClass} draggable="true" style={backgroundColor}
        onDragStart={this.onDragStart.bind(this, event)}
        onDragOver={this.onDragOver.bind(this, event)}
        onDrop={this.onDrop.bind(this, event)} >

        {this.props.data.label}
      </div>
    )
  }
})

React.render(
  React.createElement(App, null),
  document.getElementById('content')
);
