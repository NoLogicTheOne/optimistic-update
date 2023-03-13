import clsx from 'clsx';
import React, { FC, PropsWithChildren } from 'react';

import styles from './TargetTemperatureControl.module.css';

type TargetTemperatureControlProps = {
  current?: number;
  increment: () => void;
  decrement: () => void;
  disabled?: boolean;
  rotate?: number;
};

const ActionButton: FC<
  PropsWithChildren<{ onClick: () => void; disabled?: boolean }>
> = React.memo(({ children, onClick, disabled }) => {
  return (
    <button
      className={clsx(styles.action, disabled && styles.disabled)}
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
});

export const TargetTemperatureControl: FC<TargetTemperatureControlProps> = ({
  current = 'N/A',
  increment,
  decrement,
  rotate = 90,
  disabled
}) => {
  return (
    <span className={styles.controlWrapper}>
      <ActionButton disabled={disabled} onClick={decrement}>
        -
      </ActionButton>

      <span
        className={styles.temperatureOuter}
        style={{ transform: `rotate(${90 - rotate}deg)` }}
      >
        <span
          className={styles.temperatureInner}
          style={{ transform: `rotate(${rotate - 90}deg)` }}
        >
          {current}&#176;
        </span>
      </span>

      <ActionButton disabled={disabled} onClick={increment}>
        +
      </ActionButton>
    </span>
  );
};
