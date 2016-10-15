import React, { Component, PropTypes } from 'react';
import TodoItem from './TodoItem';
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters';
import style from './MainSection.css';

export default class MainSection extends Component {

  static propTypes = {
    todos: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {'current_url_data': ''};

    this.loadDataFromLocalStorage = this.loadDataFromLocalStorage.bind(this);
  }

  loadDataFromLocalStorage() {
    let current_url = 'current_url';

    chrome.storage.local.get(current_url, function (result) {
      // Ye nahi mila to kuch gadbad hai, ise milna chahiye
      let real_current_url = result.current_url;
      console.log(result);
      console.log(real_current_url);
      chrome.storage.local.get(real_current_url, function (response) {
        console.log(response);
        console.log(response.real_current_url);
      }.bind(this));

      // let retrievedObject = [];
      // if(!result.current_url) {
      //   retrievedObject = [];
      // } else {
      //   retrievedObject = result.current_url;
      // }
      // retrievedObject.push(curr_data);
      // console.log(retrievedObject);
      // chrome.storage.local.set({'current_url': JSON.stringify(retrievedObject)}, function(){});
      // removeExistingDolphinPopup();
    }.bind(this));
  }

  componentDidMount() {
    this.loadDataFromLocalStorage();
  }

  getSelectionText() {
    let text = "";
    if(window.getSelection) {
      text = window.getSelection().toString();
    }
    return text;
  }

  render() {
    const { todos, actions } = this.props;
    const { filter } = this.state;
    console.log(this.state);

    if(!this.state.current_url_data) {
      console.log("----");
      return null;
    }

    return (
      <section className={style.main}>
        <ul className={style.todoList}>
          {this.state.current_url_data.map(dolphin =>
            <li>
            <div>
              {dolphin.selected_text}
            </div>
            <div>
              {dolphin.dolphin_message}
            </div>
            </li>
          )}
        </ul>
      </section>
    );
  }
}
