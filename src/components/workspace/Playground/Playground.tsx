import React, { useEffect, useState } from 'react';
import PreferenceNav from './PreferenceNav/PreferenceNav';
import Split from 'react-split';
import CodeMirror from "@uiw/react-codemirror"
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import EditorFooter from './EditorFooter';
import { Problem } from '@/utils/types/problem';
import { toast } from 'react-toastify';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/firebase/firebase';
import { useRouter } from 'next/router';
import { problems } from '@/utils/problems';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import useLocalStorage from '@/hooks/useLocalStorage';

type PlaygroundProps = {
    problem:Problem
	setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
	setSolved: React.Dispatch<React.SetStateAction<boolean>>;
};


export interface ISettings{
	fontSize: string,
	settingsModalIsOpen: boolean,
	dropdownIsOpen: boolean,
}


const Playground:React.FC<PlaygroundProps> = ({problem, setSuccess, setSolved}) => {

    const [activeTestCaseId, setActiveTestCaseId] = useState(0);
	let [usercode, setUserCode] = useState(problem.starterCode);
	const [user] = useAuthState(auth);
	const router = useRouter();
	const {query: {pid}} = router;
	const [fontSize, setFontSize] = useLocalStorage("lc-fontstyle", "16");
	const [settings, setSettings] = useState<ISettings>({
		fontSize: "16px",
		settingsModalIsOpen: false,
		dropdownIsOpen: false,

	})
	// console.log("test case: ", activeTestCaseId);

	const handleTestCaseToggle = () => {
		setActiveTestCaseId(1);
	}

	const handleSubmit = async () => {
		if(!user){
			toast.error("please log in to submit the code", {position: "top-center", autoClose: 3000, theme: 'dark'});

			return;
		}

		try{
			usercode = usercode.slice(usercode.indexOf(problem.starterFunctionName)); 
			const cb = new Function(`return ${usercode}`)();  
			const handler = problems[pid as string].handlerFunction;

			if(typeof handler == "function"){
				const success = handler(cb);
				if(success){
					setSuccess(true);
					toast.success("Congrats!, All tests passed", {position: 'top-center', theme: 'dark', autoClose: 3000})
					setTimeout(() => {
						setSuccess(false);
					},3000);
					setSolved(true);

					//push it into the database 
					const userRef = doc(firestore, "users", user.uid);
					const userDoc = await getDoc(userRef);
					if(userDoc.exists()){
						
						//already solved or solving now for the first time 
						if(userDoc.data().solvedProblems.includes(pid)){
							console.log("already solved");
						}
						else{
							await updateDoc(userRef, {solvedProblems: [...userDoc.data().solvedProblems, pid]});
							console.log("solving for the first time");
						}

					}

				}
			}
			

		}
		catch(error:any) {
			console.log(error.message);
			if(error.message.startsWith("AssertionError [ERR_ASSERTION]: Expected")){
				toast.error("one or more test cases failed", {position: 'top-center', autoClose:3000,theme:'dark'})
			}
			else{
				toast.error(error.message, {
					position: 'top-center',
					autoClose: 3000,
					theme: 'dark'
				})
			}
		}
	}

	const onChange = (value: string) => {
		setUserCode(value);
		localStorage.setItem(`Code-${pid}`, JSON.stringify(value));
	}

	useEffect (()=> {
		const code = localStorage.getItem(`Code-${pid}`);
		// console.log("retreived code is ", code);
		if(user){
			setUserCode(code? JSON.parse(code): problem.starterCode );
		}
		else{
			setUserCode(problem.starterCode);
		}
	}, [pid, user, problem.starterCode])

    return(
        <>
            <div className='flex flex-col bg-dark-layer-1 relative overflow-x-hidden'>
			<PreferenceNav settings={settings} setSettings = {setSettings} setFontSize = {setFontSize}/>

			<Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={[60, 40]} minSize={60}>
				<div className='w-full overflow-auto'>
					<CodeMirror
						value={usercode}
						theme={vscodeDark}
						extensions={[javascript()]}
						style={{ fontSize:  fontSize}}
						onChange={onChange}
					/>
				</div>
				<div className='w-full px-5 overflow-auto'>
					{/* Testcase Heading  */}
					<div className='flex h-10 items-center space-x-6'>
						<div className='relative flex h-full flex-col justify-center cursor-pointer'>
							<div className='text-sm font-medium leading-5 text-white '>Test Cases</div>
							<hr className='absolute bottom-0 w-full h-0.5 rounded-full border-none bg-white'/>

						</div>
					</div>

					<div className="flex">
						{/* Case 1	 */}
						
						{problem.examples.map((ex) => (
							<div className='mr-2 items-start mt-2 ' key={ex.id} onClick={() => {
								setActiveTestCaseId(ex.id);
							}}>
							<div className='flex flex-wrap items-center gap-y-4'>
								<div className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
									${activeTestCaseId===ex.id ? "text-white":"text-gray-500"}
									`}>
									Case {ex.id}
								</div>
							</div>

						</div>
						))}
						

					</div>

					{/* Individual test cases  */}
					
						{problem.examples.map((cases) => (
							cases.id === activeTestCaseId && (
								
								<div className='font-semibold my-4' key={cases.id}>
									<p className='text-sm font-medium mt-4 text-white'>Input</p>
									<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>{cases.inputText}</div>
									<p className='text-sm font-medium mt-4 text-white'>Output</p>
									<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>{cases.outputText}</div>
								</div>
							)
						))}
					

					
				
				</div>
				
			</Split>
			<EditorFooter handleSubmit = {handleSubmit}/>
			
            </div>
        </>
    )
}
export default Playground;