import React from 'react';

interface LinkAction {}

interface CallbackAction {}

export interface IPageProps {
  title?: string;
  primaryAction?: any;
  secondaryAction?: any;
  children: React.ReactNode;
}

export function Page(props: IPageProps) {
  return (
    <>
      {props.title && (
        <div className={'flex items-center justify-between'}>
          <div>
            <h1 className='text-lg font-semibold md:text-2xl'>{props.title}</h1>
          </div>
        </div>
      )}
      {props.children}
    </>
  );
}
