import React, { useContext, useRef, useReducer } from 'react'
import EditorJs from "react-editor-js";
import Paragraph from "@editorjs/paragraph"
import Image from "@editorjs/image";
import Header from "@editorjs/header"
import { ArticleContext } from "../contexts/ArticleContext";
import _ from "lodash";

// currently we are using Paragraph, Image and Header tools
// we can add more later
const EDITOR_JS_TOOLS = {
  paragraph: {
    class: Paragraph,
    inlineToolbar: true
  },
  image: {
    class: Image,
    inlineToolbar: true,
    config: {
      endpoints: {
        byFile: process.env.REACT_APP_BASE_URL_SERVER + '/api/article-image-upload', // backend file uploader endpoint
      }
    }
  },
  header: {
    class: Header,
    config: {
      inlineToolbar: true,
      placeholder: 'Heading',
      levels: [2, 3, 4, 5],
      defaultLevel: 3,
    }
  },
  // embed: Embed,
  // table: Table,
  // list: List,
  // warning: Warning,
  // code: Code,
  // linkTool: LinkTool,
  // raw: Raw,
  // header: Header,
  // quote: Quote,
  // marker: Marker,
  // checklist: CheckList,
  // delimiter: Delimiter,
  // inlineCode: InlineCode,
  // simpleImage: SimpleImage
}


const Editor = ({ data }) => {

  const [article, setArticle] = useContext(ArticleContext);

  const editorInstanceRef = useRef(null);

  const onReady = () => {
    if (data)
      editorInstanceRef.current.blocks.render(data);
  }

  const onChange = (api, newData) => {
    setArticle({
      title: article.title,
      text: newData,
      tags: article.tags,
      headerImage: article.headerImage
    });
  }

  return (
    <div>
      <EditorJs
        data={data}
        placeholder="Tell your story..."
        tools={EDITOR_JS_TOOLS}
        onChange={(api, newData) => onChange(api, newData)}
        instanceRef={instance => editorInstanceRef.current = instance}
        onReady={onReady}
        autofocus={true}
      />
    </div>
  )
}

export default Editor
