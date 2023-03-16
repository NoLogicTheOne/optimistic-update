import { FC, useState } from "react";
import { Breakpoint } from "../../types";

import styles from "./BreakpointsControl.module.css";

type BreakpointProps = {
  onAdd: (breakpoint: Breakpoint) => Promise<any>;
  onDelete: (id: string) => Promise<any>;

  breakpoints: Breakpoint[];
};

export const BreakpointsControl: FC<BreakpointProps> = ({
  breakpoints,
  onAdd,
  onDelete,
}) => {
  const [nextBreakpoint, setNextBreakpoint] = useState<number>();

  return (
    <span className={styles.wrapper}>
      <span className={styles.row}>
        <input
          type="number"
          value={nextBreakpoint || 25}
          onChange={(e) => setNextBreakpoint(+e.target.value)}
          className={styles.input}
        />
        <button
          className={styles.add}
          onClick={() =>
            nextBreakpoint &&
            onAdd({ id: `break:${nextBreakpoint}`, degree: nextBreakpoint })
          }
        >
          +
        </button>
      </span>

      {breakpoints.map((breakpoint) => (
        <span key={breakpoint.id} className={styles.row}>
          Запомнили число {breakpoint.degree}
          <button
            onClick={() => onDelete(breakpoint.id)}
            className={styles.delete}
          >
            &times;
          </button>
        </span>
      ))}
    </span>
  );
};
