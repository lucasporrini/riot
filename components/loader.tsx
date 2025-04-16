import { ScaleLoader } from "react-spinners";

export const Loader = ({
  color = "#000",
  size = 10,
  className,
}: {
  color?: string;
  size?: number;
  width?: number;
  className?: string;
}) => {
  return (
    <div className={className}>
      <ScaleLoader height={size} width={size} color={color} />
    </div>
  );
};
