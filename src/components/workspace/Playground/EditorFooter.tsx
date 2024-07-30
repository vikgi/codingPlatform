import React from 'react';

type EditorFooterProps = {
    handleSubmit: () => void 
};

const EditorFooter:React.FC<EditorFooterProps> = ({handleSubmit}) => {
    
    return (
        <div className="absolute bottom-4 right-4 space-x-2 z-10">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
        // onClick={handleRun}
      >
        Run
      </button>
      <button
        className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
    )
}
export default EditorFooter;