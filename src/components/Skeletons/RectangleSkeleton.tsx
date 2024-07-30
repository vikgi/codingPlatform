import React from 'react';

type RectangleSkeletonProps = {
    
};

const RectangleSkeleton:React.FC<RectangleSkeletonProps> = () => {
    
    return <div className={`flex items-center space-x-1 rounded p-[3px] ml-4 h-5 w-10 text-lg bg-dark-fill-3 animate-pulse`}></div>
}
export default RectangleSkeleton;