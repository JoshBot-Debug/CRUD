import NProgress from "nprogress";
import { useEffect } from "react";
import { useNavigation } from "react-router";

NProgress.configure({ showSpinner: false });

export default function useNProgress() {
  const navigation = useNavigation();

  const isLoading =
    navigation.state === "loading" || navigation.state === "submitting";

  useEffect(() => {
    if (isLoading) NProgress.start();
    else NProgress.done();
  }, [isLoading]);

  return isLoading;
}
