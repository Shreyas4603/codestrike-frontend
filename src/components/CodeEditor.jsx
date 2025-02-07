import React, { useRef, useEffect } from "react";
import { Editor } from "@monaco-editor/react";

const CodeEditor = ({ code, readOnly = false, onChange = () => {} }) => {
	const editorRef = useRef(null);
	const lastCopiedText = useRef("");

	useEffect(() => {
		const handleCopy = () => {
			if (editorRef.current?.hasTextFocus?.()) {
				lastCopiedText.current = editorRef.current
					.getModel()
					.getValueInRange(editorRef.current.getSelection());
			}
		};

		const preventExternalPaste = (e) => {
			if (!editorRef.current?.hasTextFocus?.()) {
				e.preventDefault();
				return;
			}

			const clipboardText = e.clipboardData.getData("text");
			if (clipboardText !== lastCopiedText.current) {
				e.preventDefault();
			}
		};

		document.addEventListener("copy", handleCopy);
		document.addEventListener("paste", preventExternalPaste);
		return () => {
			document.removeEventListener("copy", handleCopy);
			document.removeEventListener("paste", preventExternalPaste);
		};
	}, []);

	return (
		<div
			className="h-full"
			onCopy={(e) => {
				if (!editorRef.current?.hasTextFocus?.()) {
					e.preventDefault();
				}
			}}
		>
			<Editor
				className="h-full"
				theme="vs-dark"
				language="python"
				value={code}
				onMount={(editor) => {
					editorRef.current = editor;
				}}
				options={{
					readOnly,
					scrollBeyondLastLine: false,
					padding: { top: 8, bottom: 8 },
					readOnly: false,
					minimap: { enabled: false },
					scrollBeyondLastLine: false,
					padding: { top: 8, bottom: 8 },
					contextmenu: false,
					quickSuggestions: false,
					suggestOnTriggerCharacters: false,
					parameterHints: { enabled: false },
					suggestions: { enabled: false },
					codeLens: false,
					wordBasedSuggestions: false,
					copyWithSyntaxHighlighting: false,
					enableBasicAutocompletion: false,
					enableLiveAutocompletion: false,
					enableSnippets: false,
				}}
				onChange={(value) => {
					if (!readOnly) {
						onChange(value);
					}
				}}
			/>
		</div>
	);
};

export default CodeEditor;
