import ClientFadeIn from "@/components/ClientFadeIn";

export default function ECA() {
  return (
    <main>
      <div className="pt-[100px] p-[300px]">
        <strong className="text-2xl">External Content Agreement (ECA)</strong>
        <br />
        By making external content available for anyone to see, there needs to
        be an agreement to keep MHSF ("Minehut Server List") a friendly place
        for anyone to look at.{" "}
        <i>
          As such, this agreement outlines what you can't and can do, when
          making content on the platform.
        </i>{" "}
        The goal by making an agreement like this, is not to make you worried
        what you can upload, its just showing what the limits of content
        uploaded onto the platform are.
        <br />
        <br />
        <ClientFadeIn>
          <div>
            <strong className="text-xl">Source Code</strong>
            <br />
            The source code for MHSF is defined by the{" "}
            <a href="https://github.com/DeveloLongScript/MHSF/blob/main/LICENSE">
              MIT License
            </a>
            . You are free to use MHSF for commercial use, and you may modify
            the software however you'd like. Taking copies of the software (aka
            <i>"forking"</i>) is also freely allowed.
            <br />
          </div>
        </ClientFadeIn>
        <br />
        <ClientFadeIn delay={200}>
          <div>
            <strong className="text-xl">What your limits are</strong>
            <br />
            When creating content, if its a matter of making a profile picture,
            or editing the description for a server, (and more), you must follow
            the underlying agreements below.
            <br />
            For making banners & descriptions, you must follow{" "}
            <a href="https://minehut.wiki.gg/wiki/Rules">
              Minehuts Terms of Service
            </a>{" "}
            <i>
              as all content made is associated to Minehut (as the server is
              mostly on a community for Minehut).
            </i>{" "}
            <br />
            For making Discord server embeds, you must follow{" "}
            <a href="https://discord.com/terms/">
              Discords Terms of Service
            </a>{" "}
            <i>as all content made is associated to Discord.</i> <br />
            <strong>
              For all other content, they must follow the following: <br />
            </strong>
            - No inappropriate/adult images <br />
            - No swear words of any kind or slurs <br />- Endorsing unethical
            client modifications (aka cheating or hacking)
            <br />
          </div>
        </ClientFadeIn>
        <br />
        <ClientFadeIn delay={400}>
          <div>
            <strong className="text-xl">When you agree to the ECA</strong>
            <br />
            When you add customization to your server, or add a profile picture
            (linking an account is included), you must follow the ECA.
            <br />
          </div>
        </ClientFadeIn>
        <br />
        <ClientFadeIn delay={600}>
          <div>
            <strong className="text-xl">When linking an account</strong>
            <br />
            When linking an account, you must follow the privacy policy and
            terms of service to the associated service that you linked your MHSF
            account to. Additionally, if you link an external account{" "}
            <i>after</i> account creation, everything said before is still true.
            <br />
          </div>
        </ClientFadeIn>
        <br />
        <ClientFadeIn delay={800}>
          <div>
            <strong className="text-xl">Violations</strong>
            <br />
            Violations from above have 1 warning. Your first interaction is a
            warning by removing the content from MHSF, and your 2nd is
            banning/deleting your account. (some violations are an instant
            delete)
          </div>
        </ClientFadeIn>
        <br />
        <ClientFadeIn delay={1000}>
          <div>
            <strong className="text-xl">Reporting</strong>
            <br />
            If you personally see a violation of the ECA, you can report it by
            clicking the customization tab on a server, and hitting the Report
            button (it doesn't appear when the server was never owned). If you
            misuse this feature, you may get your account deleted.
          </div>
        </ClientFadeIn>
      </div>
    </main>
  );
}
