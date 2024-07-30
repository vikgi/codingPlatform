import { app, auth, firestore } from '@/firebase/firebase';
import { DBProblem } from '@/utils/types/problem';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { link } from 'fs';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { AiFillYoutube } from 'react-icons/ai';
import { BsCheckCircle, BsCircle } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import { toast } from 'react-toastify';
import YouTube from 'react-youtube';
import { useGetUserDataonProblem } from '../workspace/ProblemDescription/ProblemDescription';

type ProblemsTableProps = {
    setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>;

};

const ProblemsTable:React.FC<ProblemsTableProps> = ({setLoadingProblems}) => {
    const [youtubePlayer, setYoutubePlayer] = useState({
        isOpen: false,
        videoId: ""
    });

    const closeModal = () => {
        setYoutubePlayer({isOpen:false, videoId:""});
    }

    useEffect(()=> {
        const handleEsc = (e:KeyboardEvent) => {
            if(e.key === "Escape") closeModal();
        };

        window.addEventListener("keydown",handleEsc);

        return () => window.removeEventListener("keydown", handleEsc);

    }, [])

    const problems = useGetProblems(setLoadingProblems);
    const [user] = useAuthState(auth);
    console.log("viki ", problems)
    
    
    

    


    return <>

            <tbody className='text-white'>
                {problems.map((problem, idx) =>  {
                    const difficultyColor = problem.difficulty === "Easy"?"text-dark-green-s" : problem.difficulty === "Medium"?"text-dark-yellow": "text-dark-pink";
                    return (
                        <tr className={`${idx%2 == 1? 'bg-dark-layer-1' : ''}`} key={problem.id}>
                            <th className='px-2 py-4 font-medium whitespace-nowrap text-dark-green-s'>
                                <ProblemStatus problemId={problem.id} />
                            </th>
                            {/* <td>{problem.id}</td>
                            <td>{problem.title}</td>
                            <td>{problem.difficulty}</td>
                            <td>{problem.category}</td>
                            <td>{problem.videoId}</td>
                             */}
                             <td className='px-6 py-4'>
                                {(problem.link === "")? (
                                    <Link className='hover:text-blue-600 cursor-pointer' href={`/problems/${problem.id}`}>{problem.title}</Link>
                                ) : (
                                    
                                    <Link className='hover:text-blue-600 cursor-pointer' href={problem.link as string} target='_blank'>{problem.title}</Link>
                                )}
                             </td>

                             <td className = {`px-6 py-4 ${difficultyColor}`}>
                                {problem.difficulty}
                             </td>
                              <td className = 'px-6 py-4 '>
                                {problem.category}
                             </td>
                             <td className = 'px-6 py-4 '>
                                {problem.videoId? (<AiFillYoutube onClick={() => setYoutubePlayer({isOpen:true, videoId:problem.videoId as string})} fontSize={"28"} className='cursor-pointer hover:text-red-600'/>) : (<p className='text-gray-400'>Coming Soon</p>)}
                             </td>
                        </tr>
                    )
                })}
                

            </tbody>
                {youtubePlayer.isOpen && (
                    <tfoot className='fixed top-0 left-0 h-screen w-screen flex items-center justify-center'>
					<div className='bg-black z-10 opacity-70 top-0 left-0 w-screen h-screen absolute' onClick={closeModal}></div>
					<div className='w-full z-50 h-full px-6 relative max-w-4xl'>
						<div className='w-full h-full flex items-center justify-center relative'>
							<div className='w-full relative'>
								<IoClose fontSize={"35"} className='cursor-pointer absolute -top-16 right-0' onClick={closeModal}/>
								<YouTube videoId={youtubePlayer.videoId} loading='lazy' iframeClassName='w-full min-h-[500px]' />
							</div>
						</div>
					</div>
				</tfoot>
                )}
				
			

    </>
}
export default ProblemsTable;


function useGetProblems(setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>){
    const [problems, setProblems] = useState<DBProblem[]>([]);

    useEffect(()=> {
        const getProblems = async () => {
            //fetching data logic
            setLoadingProblems(true); 
            const q = query(collection(firestore, "problems"), orderBy("order", "asc"))
            try {
                
                const querySnapshot = await getDocs(q);
                const temp:DBProblem[] = [];
                querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());
                temp.push({id:doc.id, ...doc.data()} as DBProblem);
                });
                
                setProblems(temp);

            } catch (error:any) {
                console.log(error);
                return;
            }

            setLoadingProblems(false);
            
        }

        getProblems();
    }, [setLoadingProblems, setProblems])


    return problems;
}

interface ProblemStatusProps {
  problemId: string;
}

const ProblemStatus: React.FC<ProblemStatusProps> = ({ problemId}) => {
  const { solved } = useGetUserDataonProblem(problemId);

  return solved ? <BsCheckCircle fontSize={'18'} width={'18'} /> : null;
};