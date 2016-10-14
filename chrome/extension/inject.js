import React, { Component } from 'react';
import { render } from 'react-dom';
import Dock from 'react-dock';
import $ from 'jquery';

class InjectApp extends Component {
  constructor(props) {
    super(props);
    this.state = { isVisible: false };
  }

  buttonOnClick = () => {
    this.setState({ isVisible: !this.state.isVisible });
  };

  render() {
    return (
      <div>
        <button onClick={this.buttonOnClick}>
          Open TodoApp
        </button>
        <Dock
          position="right"
          dimMode="transparent"
          defaultSize={0.4}
          isVisible={this.state.isVisible}
        >
          <iframe
            style={{
              width: '100%',
              height: '100%',
            }}
            frameBorder={0}
            allowTransparency="true"
            src={chrome.extension.getURL(`inject.html?protocol=${location.protocol}`)}
          />
        </Dock>
      </div>
    );
  }
}


class DolphinComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      dolphin_message: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  buttonOnClick = () => {
    this.setState({ isVisible: !this.state.isVisible });
  };

  handleChange(e) {
    this.setState({'dolphin_message': e.target.value});
  }

  render() {

    let flag = this.state.show_dolphin_comment_popup;
    let textareadStyle = {
      marginTop: 5,
      width: "100%",
      resize: "vertical",
    };

    return (
      <div ref="dolphin-popup" className="dolphin-comment-child">
        <div> URL: {this.state.data.current_url} {this.state.data.selected_text} </div>
        <textarea
          value={this.state.dolphin_message}
          type='text'
          placeholder='Add optional comment. Eg: Teacher said this will be in exam'
          style={textareadStyle}
          onChange={this.handleChange}
        />
        <button onClick={this.buttonOnClick}>
          Save
        </button>
      </div>
    );
  }
}

let getSelectionText = (e) => {

  if($(e.target).parents('.dolphin-comment-parent').hasClass('dolphin-comment-parent') || $(e.target).hasClass('dolphin-comment-parent')) {
    return;
  }

  // Remove the existing with dolphin-comment-parent class name before injecting another
  let previousElement = document.getElementsByClassName('dolphin-comment-parent')[0];
  if (typeof previousElement !== 'undefined') {
    previousElement.remove();
  }

  let text = "";
  if (typeof window.getSelection !== "undefined") {
      text = window.getSelection().toString();
  } else {
    return;
  }

  if (!text) {
    return;
  }

  console.log(text);

  var data = {
    'selected_text': text,
    'current_url': window.location.href,
  }

  const injectCommentForm = document.createElement('div');
  injectCommentForm.className = "dolphin-comment-parent";

  let selected_text_offset = window.getSelection().getRangeAt(0).getBoundingClientRect();
  console.log(selected_text_offset);
  let _top = selected_text_offset.top;

  injectCommentForm.style.cssText = 'width:400px; position:fixed; padding:10px; right:100px; \
    background: #f5f5f5; border-radius:3px; box-sizing:border-box; box-shadow: 1px 1px 5px 1px rgba(159,167,194, 0.6);';
  injectCommentForm.style.top = _top + 'px';

  document.body.appendChild(injectCommentForm);
  render(<DolphinComment data={data} />, injectCommentForm);

  return text;
}




window.addEventListener('load', () => {

  const injectDOM = document.createElement('div');
  injectDOM.className = 'inject-react-example';
  injectDOM.style.textAlign = 'center';
  document.body.appendChild(injectDOM);

  document.onmouseup = getSelectionText;
  document.onkeyup = getSelectionText;

  render(<InjectApp />, injectDOM);
});
