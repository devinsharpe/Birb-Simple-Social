import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import { useEffect } from "react";
import { useAtom } from "jotai";
import atoms from "../../atoms";
import { Visibility } from "@prisma/client";

const ReactionsAtomProvider = () => {
  const [reactionsAtom, setReactionsAtom] = useAtom(atoms.reactions);
  const session = useSession();
  const reactions = trpc.profileReactions.list.useQuery(
    { status: Visibility.ACTIVE },
    {
      enabled: session.status === "authenticated",
    }
  );

  useEffect(() => {
    if (reactions.data) {
      setReactionsAtom(reactions.data);
    } else setReactionsAtom([]);
  }, [reactions.data]);

  return null;
};

export default ReactionsAtomProvider;
