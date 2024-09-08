const CardSkeleton = () => {
	return (
		<>
			<div className='flex gap-3 items-center'>
			<div className="skeleton bg-gray-800 w-56 h-32 mx-2"></div>
			</div>
		
		</>
	);
};
export default CardSkeleton;

export const GraphSkeleton = () => {
	return (
		<>
			<div className='flex gap-3 items-center'>
			<div className="skeleton bg-gray-800 w-[29rem] h-[29rem] mx-4"></div>
			</div>
		
		</>
	);
};
