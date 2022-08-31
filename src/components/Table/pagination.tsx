import React from 'react'
import "./pagination.css"

type PaginationProps = {
  total: number,
  perPageAmount?: number,
  selectCurrentPage: (page: number) => void;
}

export default function Pagination({
  total,
  selectCurrentPage,
  ...props
}: PaginationProps) {

  return (
    <div className='pagination__container'>
      <ul className='pagination'
        style={{display: 'flex', gap: 2}}>
        {Array.from(Array(total).keys()).map(number =>{
            return (
              <PaginationItem key={number}
                pageNumber={number + 1}
                label={(number + 1).toString()}
                onSelect={(page) =>{
                  selectCurrentPage(page);
                }}
              ></PaginationItem>
            )
        })}
      </ul>
    </div>
  )
}

type PaginationItemProps = {
  pageNumber: number;
  label?: string;
  children?: React.ReactNode | string;
  isActive?:boolean;
  onSelect: (page: number) => void;
}
function PaginationItem({label, children,pageNumber, onSelect, ...props}: PaginationItemProps){
  return (
    <li className={`pagination__item`} 
      aria-selected={!!props.isActive}
      onClick={() => onSelect(pageNumber)}>
      {children || label}
    </li>
  )
}