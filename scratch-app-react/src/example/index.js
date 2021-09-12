import React, { useRef, useState } from 'react';
import styled from 'styled-components';

import EmailEditor from 'react-email-editor';
import sample from './sample.json';
import Dropdown, { Option } from "./listCompnent";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
`;

const Bar = styled.div`
  flex: 1;
  background-color: #61dafb;
  color: #000;
  padding: 10px;
  display: flex;
  max-height: 60px;
  h1 {
    flex: 1;
    font-size: 16px;
    text-align: left;
  }
  button {
    flex: 1;
    padding: 10px;
    margin-left: 10px;
    font-size: 14px;
    font-weight: bold;
    background-color: #000;
    color: #fff;
    border: 0px;
    max-width: 150px;
    cursor: pointer;
  }
`;

const WrapperDropdown = styled.div`
h2 {
  text-align:center;
  margin:5px;
}
`;

const Example = (props) => {
  let state = {
    Template: true,
    TemplateName: "",
    Editlist: false
  };

  const [listsync, setlistsync] = useState(false);
  const [optionValue, setOptionValue] = useState("Edit Template");
  let listAvailable = false;
  let list = useRef([]);
  let refTemplateName = useRef("");

  const emailEditorRef = useRef(null);

  const createTemplate = () => {
    state.TemplateName = "";
    refTemplateName.current = "";
    emailEditorRef.current.editor.loadBlank();
  };

  async function Options() {
    let fetchRes = await fetch(
      "https://www.trusted-doctor.com:8000/listTemplates/").then(res =>
        res.json()).then(d => {
          //console.log(d);
          list.current = [];
          d.forEach(element => {
            list.current.push(<Option value={element} />);
          });
          console.log(list.current);
          listAvailable = true;
          if (listsync == false)
            setlistsync(true);
        });
  };

  function OptionList() {
    return list.current;
  }

  const saveDesign = () => {
    var person = null;
    if (refTemplateName.current == "")
      person = prompt("Enter Template name");
    else person = refTemplateName.current;
    if (person != null) {
      emailEditorRef.current.editor.saveDesign((design) => {
        console.log('saveDesign', design);
        design = { "name": person, "template": design };
        let options = {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json;charset=utf-8'
          },
          body: JSON.stringify(design)
        };

        // Fake api for making post requests
        let fetchRes = fetch(
          "https://www.trusted-doctor.com:8000/saveTemplate/",
          options);
        fetchRes.then(res =>
          res.json()).then(d => {
            console.log(d)
            setlistsync(false);
          });
        alert('Design JSON has been logged in your developer console.');
      });
      state.TemplateName = person;
      refTemplateName.current = person;
    }
    else
      alert("Template not saved");
  };

  const exportHtml = () => {
    emailEditorRef.current.editor.exportHtml((data) => {
      const { design, html } = data;
      console.log('exportHtml', html);
      alert('Output HTML has been logged in your developer console.');
    });
  };

  const onDesignLoad = (data) => {
    console.log('onDesignLoad', data);
  };

  const onLoad = () => {
    emailEditorRef.current.editor.addEventListener(
      'onDesignLoad',
      onDesignLoad
    );
    emailEditorRef.current.editor.loadDesign(sample);
  };

  const handleSelect = (e) => {
    setOptionValue(e.target.value);
    let fetchRes = fetch(
      "https://www.trusted-doctor.com:8000/getTemplate/" + e.target.value).then(res =>
        res.json()).then(d => {
          //console.log(d);
          let tempTemplate = d.template;
          emailEditorRef.current.editor.loadDesign(tempTemplate);
          state.TemplateName = d.name;
          refTemplateName.current = d.name;
        });
  };

  if (listAvailable == false)
    Options();

  return (
    <Container>
      <Bar>
        <h1>My React Email Editing</h1>

        <button onClick={createTemplate}>Create Template</button>
        <Dropdown
          formLabel="Choose a service"
          buttonText="Send form"
          onChange={handleSelect}
          action="/"
        >
          <Option value="Edit Template" />
          <OptionList />
        </Dropdown>
        <button onClick={saveDesign}>Save Design</button>
        <button onClick={exportHtml}>Export HTML</button>
      </Bar>

      {(optionValue != "Edit Template") ? <WrapperDropdown>
        <h2>Editing Template {optionValue}</h2></WrapperDropdown> : ""}

      <React.StrictMode>
        <EmailEditor ref={emailEditorRef} onLoad={onLoad} />
      </React.StrictMode>

    </Container>
  );
};

export default Example;