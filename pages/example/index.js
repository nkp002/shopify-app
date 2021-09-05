import React, { useRef } from 'react';
import styled from 'styled-components';

import EmailEditor from 'react-email-editor';
import sample from './sample.json';

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

const Example = (props) => {
  let state={
    Template:true
  };

  const emailEditorRef = useRef(null);

  const createTemplate = () => {
    if(!state.Template){
      state.Template=true;
    return <EmailEditor ref={emailEditorRef} onLoad={onLoad} />;
    }
    else { 
      state.Template=false
    return <div></div>;
    }
  };

  const editTemplate = (props) => {
    if(!state.Template){
      state.Template=true;
    return <button onClick={createTemplate}>Create Template</button>;
    }
    else { 
      state.Template=false
    return <div></div>;
    }    
  };

  const saveDesign = () => {
    emailEditorRef.current.editor.saveDesign((design) => {
      console.log('saveDesign', design);
      alert('Design JSON has been logged in your developer console.');
    });
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

  return (
    <Container>
      <Bar>
        <h1>My React Email Editing</h1>

        <editTemplate/>
        <button onClick={editTemplate}>Edit Template</button>
        <button onClick={saveDesign}>Save Design</button>
        <button onClick={exportHtml}>Export HTML</button>
      </Bar>

      <React.StrictMode>
        <EmailEditor ref={emailEditorRef} onLoad={onLoad} />
      </React.StrictMode>
      
    </Container>
  );
};

export default Example;