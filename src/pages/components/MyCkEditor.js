import React, {useState} from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneAltSlash,
} from "@fortawesome/free-solid-svg-icons";

const API_URL = process.env.REACT_APP_API_URL;
const IMG_URL = process.env.REACT_APP_IMG_PATH;
const UPLOAD_ENDPOINT = "/kmarticle/ckEditor/attachment";

export default function MyEditor({ data, setState, clearDescErr, ...props }) {
  const [isVoiceInputActive, setIsVoiceInputActive] = useState(false);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = true;

  const startVoiceInput = () => {
    recognition.start();
    recognition.onresult = handleVoiceInput;
    setIsVoiceInputActive(true);
  };

  const handleVoiceInput = (event) => {
    const result = event.results[event.results.length - 1][0].transcript;
    const newContent = data + result; // Append recognized text to existing content
    setState(newContent);

    const editorInstance = document.querySelector(".ck-editor__editable");
    if (editorInstance) {
      editorInstance.innerHTML = newContent;
    }
  };

  const stopVoiceInput = () => {
    recognition.stop();
    recognition.onresult = null; // Remove the event listener
    setIsVoiceInputActive(false); // Set voice input to inactive
    // Reset recognition to start fresh when the user clicks start again
    recognition.abort();
    recognition.start(); // Start a new recognition session
  };

  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
            loader.file.then(async (file)=>{
                const formData = new FormData();
                formData.append("image", file);
                await axios.post(`${API_URL}/${UPLOAD_ENDPOINT}`, formData).then((res)=>{
                    resolve({
                                  default: `${IMG_URL}/${res.data.filePath}`
                                });
                }).catch((err)=>{
                    reject(err);
                })
            })
        })
      }
    };
  }
  const handleEditorChange = (event, editor) => {
    if (editor) {
      const edata = editor.getData();
      setState(edata);
      clearDescErr("eventdescription");
    }
  };
  
  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }
  return (
    <div className="App">
      <CKEditor
      data={data}
        config={{
          extraPlugins: [uploadPlugin]
        }}
        editor={ClassicEditor}
        onReady={(editor) => {}}
        onBlur={(event, editor) => {}}
        onFocus={(event, editor) => {}}
        onChange={(event, editor) => {
            handleEditorChange(event, editor)
        }}
        {...props}
      />
      <div>
                  {isVoiceInputActive ? (
                    <FontAwesomeIcon
                      icon={faMicrophone}
                      onClick={stopVoiceInput}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faMicrophoneAltSlash}
                      onClick={startVoiceInput}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </div>
    </div>
  );
}