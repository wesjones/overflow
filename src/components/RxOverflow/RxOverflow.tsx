import { forwardRef } from 'react';
import { Overflow, type OverflowProps } from '../Overflow';
import './rx.css';

const RxOverflow = forwardRef<HTMLUListElement, OverflowProps>(function RxOverflow(props, ref) {
  return <Overflow ref={ref} {...props} />;
});

export default RxOverflow;
