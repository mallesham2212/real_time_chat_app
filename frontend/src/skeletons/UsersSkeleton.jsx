import React from 'react'

const UsersSkeleton = ({count}) => {
 return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div className="flex items-center gap-3 p-2" key={idx}>
          {/* Profile Pic Skeleton */}
          <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
          
          {/* Text Skeleton */}
          <div className="flex flex-col gap-2 flex-1">
            <div className="w-24 h-3 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-16 h-2 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </>
  )
}

export default UsersSkeleton