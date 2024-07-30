import React from 'react';

type CircleSkeletonProps = {
    
};

const CircleSkeleton:React.FC<CircleSkeletonProps> = () => {
    
    return <div className="rounded p-[3px] ml-4 h-5 w-5 text-lg bg-dark-fill-3 h-6 w-6 rounded-full animate-pulse"></div>
}
export default CircleSkeleton;