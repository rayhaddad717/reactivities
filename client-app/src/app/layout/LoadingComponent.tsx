import { Dimmer, Loader } from "semantic-ui-react";

interface Props {
  inverted?: boolean; //is dark or light background
  content: string;
}
export default function LoadingComponent({
  content = "Loading...",
  inverted = true,
}: Props) {
  return (
    <Dimmer active={true} inverted={inverted}>
      <Loader content={content} />
    </Dimmer>
  );
}
