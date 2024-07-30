import Topbar from '@/components/topbar/Topbar';
import Workspace from '@/components/workspace/Workspace';
import useHasMounted from '@/hooks/useHasMounted';
import { problems } from '@/utils/problems';
import { Problem } from '@/utils/types/problem';
import React from 'react';
import Split from 'react-split';
// import './split.css'

type ProblemPageProps = {
    problem: Problem
};

const ProblemPage: React.FC<ProblemPageProps> = ({ problem }) => {
    console.log(problem);
    const hasMounted = useHasMounted();

	if(!hasMounted) return null;

    return (
        <>
            <Topbar problemPage={true} />
            <Workspace problem= {problem}/>
        </>
    );
};

export default ProblemPage;

// Fetch the local data
// SSG static site generation
// getStaticPaths -> it creates the dynamic routes

export async function getStaticPaths() {
    const paths = Object.keys(problems).map((key) => ({
        params: { pid: key }
    }));

    return {
        paths: paths,
        fallback: false,
    };
}

// getStaticProps => it fetches the data
export async function getStaticProps({ params }: { params: { pid: string } }) {
    const { pid } = params;
    const problem = problems[pid];
    if (!problem) {
        return {
            notFound: true
        };
    }
    problem.handlerFunction = problem.handlerFunction.toString();

    return {
        props: {
            problem
        }
    };
}
