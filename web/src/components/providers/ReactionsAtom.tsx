/* eslint-disable @typescript-eslint/no-unused-vars */
import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import { useEffect } from "react";
import { useAtom } from "jotai";
import atoms from "../../atoms";
// import { Visibility } from "@prisma/client";
import { Visibility } from "~/server/db/schema/enums";

const ReactionsAtomProvider = () => {
  const [reactionsAtom, setReactionsAtom] = useAtom(atoms.reactions);
  const session = useSession();
  const reactions = trpc.profileReactions.list.useQuery(
    { status: Visibility.Active },
    {
      enabled: session.status === "authenticated",
    }
  );

  useEffect(() => {
    if (reactions.data) {
      setReactionsAtom(reactions.data);
    } else setReactionsAtom([]);
  }, [reactions.data, setReactionsAtom]);

  return null;
};

export default ReactionsAtomProvider;
