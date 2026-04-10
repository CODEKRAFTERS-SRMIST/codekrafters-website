"use client";
import Image from "next/image";
import ReactLenis, { useLenis } from "lenis/react";
import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/all";

function StoryComponent() {
  gsap.registerPlugin(ScrollTrigger);
  // gsap.registerPlugin(ScrollSmoother)
  const lenisRef = useRef(null);
  const smthDivRef = useRef<HTMLDivElement>(null);
  const bgLg = useRef(null);
  // const bgSm = useRef(null);
  const manEnteringRef = useRef(null);
  const anotherDivRef = useRef<HTMLDivElement>(null);
  const commentOneRef = useRef<HTMLImageElement>(null);
  const commentTwoRef = useRef<HTMLImageElement>(null);
  const commentThreeRef = useRef<HTMLImageElement>(null);
  const sideLookingRef = useRef<HTMLImageElement>(null);
  const walkingRef = useRef<HTMLDivElement>(null);
  const walkingManRef = useRef<HTMLImageElement>(null);
  const walkingManMobRef = useRef<HTMLImageElement>(null);
  const ckRef = useRef<HTMLImageElement>(null);
  const ckMobRef = useRef<HTMLImageElement>(null);
  const moiRef = useRef<HTMLImageElement>(null);
  const moiMobRef = useRef<HTMLImageElement>(null);

  const lenis = useLenis((lenis) => {
    // called every scroll
    console.log(lenis);
  });

  useEffect(() => {
    function update(time: number): void {
      (lenisRef.current as { lenis?: { raf: (t: number) => void } } | null)?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Use ScrollTrigger.matchMedia for responsive first section animations
      ScrollTrigger.matchMedia({
        // Desktop first section animations
        "(min-width: 768px)": () => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: smthDivRef.current,
                pin: smthDivRef.current,
                scrub: 3,
                start: "0% 0%",
                endTrigger: anotherDivRef.current,
              },
            })
            .to(bgLg.current, { transform: "translateZ(2200px)" })
            .to(manEnteringRef.current, { opacity: 1 })
            .pause();
        },
        // Mobile first section animations
        "(max-width: 767px)": () => {
          if (smthDivRef.current) {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: smthDivRef.current,
                  pin: smthDivRef.current,
                  scrub: 3,
                  start: "0% 0%",
                  endTrigger: anotherDivRef.current,
                },
              })
              .to(smthDivRef.current.querySelector('#srm-bg-mob'), { transform: "translateZ(2200px)" })
              .to(smthDivRef.current.querySelector('#man-entering-mob'), { opacity: 1 })
              .pause();
          }
        },
      });
    });
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Use ScrollTrigger.matchMedia for responsive comment section animations
      ScrollTrigger.matchMedia({
        // Desktop comment section animations
        "(min-width: 768px)": () => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: anotherDivRef.current,
                pin: anotherDivRef.current,
                scrub: 1,
                start: "0% 0%",
                endTrigger: walkingRef.current,
              },
            })
            .to(commentOneRef.current, {
              yPercent: -120,
              xPercent: 55,
              opacity: 1,
            })
            .to(commentTwoRef.current, {
              yPercent: -180,
              xPercent: 100,
              opacity: 1,
            })
            .to(commentThreeRef.current, {
              yPercent: -180,
              xPercent: 215,
              opacity: 1,
            })
            .to("#panick", {
              opacity: 0,
            });
        },
        // Mobile comment section animations
        "(max-width: 767px)": () => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: anotherDivRef.current,
                pin: anotherDivRef.current,
                scrub: 1,
                start: "0% 0%",
                endTrigger: walkingRef.current,
              },
            })
            .to("#comment-1-mob", {
              yPercent: -120,
              xPercent: 55,
              opacity: 1,
            })
            .to("#comment-2-mob", {
              yPercent: -180,
              xPercent: 100,
              opacity: 1,
            })
            .to("#comment-3-mob", {
              yPercent: -180,
              xPercent: 215,
              opacity: 1,
            })
            .to("#panick-mob", {
              opacity: 0,
            });
        },
      });
    });
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    // gsap.registerEffect({
    //   name: "zoom",
    //   effect: (targets: any, config: any) => {
    //     const vars = { transformOrigin: "0px 0px", ...config },
    //       { scale, origin } = config,
    //       clamp = gsap.utils.clamp(-100 * (scale - 1), 0);
    //     delete vars.origin;
    //     vars.xPercent = clamp((0.5 - origin[0] * scale) * 100);
    //     vars.yPercent = clamp((0.5 - origin[1] * scale) * 100);
    //     vars.overwrite = "auto";
    //     return gsap.to(targets, vars);
    //   },
    //   extendTimeline: true,
    //   defaults: { origin: [0.5, 0.5], scale: 2 },
    // });
    const ctx = gsap.context(() => {
      // Use ScrollTrigger.matchMedia for responsive animations
      ScrollTrigger.matchMedia({
        // Desktop animations
        "(min-width: 768px)": () => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: walkingRef.current,
                pin: walkingRef.current,
                scrub: 1,
                start: "0% 0%",
                endTrigger: "#ck-badge",
              },
            })
            .to(walkingManRef.current, {
              transform: "translateZ(300px)",
            })
            .to(walkingManRef.current, {
              opacity: 0,
            })
            .to(ckRef.current, {
              opacity: 0,
            });
        },
        // Mobile animations
        "(max-width: 767px)": () => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: walkingRef.current,
                pin: walkingRef.current,
                scrub: 1,
                start: "0% 0%",
                endTrigger: "#ck-badge",
              },
            })
            .to(walkingManMobRef.current, {
              transform: "translateZ(300px)",
            })
            .to(walkingManMobRef.current, {
              opacity: 0,
            })
            .to(ckMobRef.current, {
              opacity: 0,
            });
        },
      });
    });
    return () => ctx.revert();
  });

  useLayoutEffect(() => {
    // Only using id's here. No refs.
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            pin: "#ck-badge",
            trigger: "#ck-badge",
            scrub: 1,
            start: "0% 0%",
          },
        })
        .to("#man-with-badge", {
          opacity: 0,
        })
        .to("#man-with-badge-mob", {
          opacity: 0,
        });
    });
    return () => ctx.revert();
  });

  return (
    <div className="min-h-full max-w-full ">
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
      <div
        ref={smthDivRef}
        className="min-h-screen max-w-full perspective-[2200px]"
        id="smth"
        onClick={() => {
          lenis?.scrollTo("#another-div", {
            duration: 1.5,
          });
        }}
      >
        {/* Desktop first section images */}
        <Image
          src="/story/srm-bg-cropped-png.png"
          alt="Your clg bruv"
          className="z-10 w-full h-full absolute hidden md:block object-cover"
          id="zoom-in"
          ref={bgLg}
          width={1625}
          height={1080}
          priority
        />
        <Image
          src="/story/man-entering-png.png"
          alt="Goi Entering SRM"
          className="z-0 w-full h-full absolute opacity-0 hidden md:block object-cover"
          ref={manEnteringRef}
          width={1920}
          height={1080}
          priority
        />

        {/* Mobile first section images */}
        <Image
          src="/story/srm-bg-png-mob.png"
          alt="Your clg bruv (mobile)"
          className="z-10 w-full h-full absolute md:hidden object-cover"
          id="srm-bg-mob"
          width={1080}
          height={1920}
          priority
        />
        <Image
          src="/story/man-entering-png-mob.png"
          alt="Goi Entering SRM (mobile)"
          className="z-0 w-full h-full absolute opacity-0 md:hidden object-cover"
          id="man-entering-mob"
          width={1080}
          height={1920}
          priority
        />
      </div>

      <div
        className="min-h-screen max-w-full bg-gray-100 flex items-center justify-center z-10 overflow-y-hidden"
        id="another-div"
        onClick={() => {
          lenis?.scrollTo("#smth", {
            duration: 1.5,
          });
        }}
        ref={anotherDivRef}
      >
        {/* Desktop panicked man section */}
        <div
          className="flex items-center justify-center z-20 w-full h-full overflow-hidden hidden md:flex"
          id="panick"
        >
          <div className="z-20 flex items-center justify-center">
            <Image
              src="/story/comment-1-png.png"
              alt="Comment 1"
              className="absolute w-1/4 h-1/4 opacity-0 left-60 bottom-40 object-contain"
              id="comment-1"
              ref={commentOneRef}
              width={675}
              height={675}
            />{" "}
            <Image
              src="/story/comment-2-png.png"
              alt="Comment 2"
              className="absolute w-1/4 h-1/4 opacity-0 left-80 bottom-50 object-contain"
              id="comment-2"
              ref={commentTwoRef}
              width={1080}
              height={1080}
            />
            <Image
              src="/story/comment-3-png.png"
              alt="Comment 3"
              className="absolute w-1/4 h-1/4 opacity-0 left-10 bottom-10 object-contain"
              id="comment-3"
              ref={commentThreeRef}
              width={1080}
              height={1080}
            />
          </div>
          <Image
            src="/story/oat-with-man-png.png"
            alt="Panicked Goi"
            className="z-10 w-full h-full object-cover"
            width={1920}
            height={1080}
          />
        </div>

        {/* Mobile panicked man section */}
        <div
          className="flex items-center justify-center z-20 w-full h-full overflow-hidden md:hidden"
          id="panick-mob"
        >
          <div className="z-20 flex items-center justify-center">
            <Image
              src="/story/comment-1-png.png"
              alt="Comment 1"
              className="absolute w-1/4 h-1/4 opacity-0 left-5 bottom-10 object-contain"
              id="comment-1-mob"
              width={675}
              height={675}
            />
            <Image
              src="/story/comment-2-png.png"
              alt="Comment 2"
              className="absolute w-1/4 h-1/4 opacity-0 left-15 -bottom-10 object-contain"
              id="comment-2-mob"
              width={1080}
              height={1080}
            />
            <Image
              src="/story/comment-3-png.png"
              alt="Comment 3"
              className="absolute w-1/4 h-1/4 opacity-0 left-8 -bottom-25 object-contain"
              id="comment-3-mob"
              width={1080}
              height={1080}
            />
          </div>
          <Image
            src="/story/oat-man-with-bg-png-mob.png"
            alt="Panicked Goi (mobile)"
            className="z-10 w-full h-full object-cover"
            width={1080}
            height={1920}
          />
        </div>

        {/* Desktop shocked man background */}
        <Image
          src="/story/shocked-man-bg-png.png"
          alt="Shocked man"
          className="h-full w-full absolute z-0 overflow-y-hidden hidden md:block object-cover"
          ref={sideLookingRef}
          width={1920}
          height={1080}
        />

        {/* Mobile shocked man background */}
        <Image
          src="/story/shocked-man-png-mob.png"
          alt="Shocked man mobile"
          className="h-full w-full absolute z-0 overflow-y-hidden md:hidden object-cover"
          width={1080}
          height={1920}
        />
      </div>

      <div
        className="min-h-screen max-w-full bg-gray-100 flex items-center justify-center z-10 overflow-y-hidden overflow-x-hidden perspective-[500px]"
        ref={walkingRef}
      >
        {/* Desktop walking images */}
        <Image
          src="/story/oat-walking-bg-png.png"
          alt="Goi walking"
          className="w-full h-full absolute z-10 hidden md:block object-cover"
          ref={walkingManRef}
          width={1920}
          height={1080}
        />
        <Image
          src="/story/ck-png.png"
          alt="Goi walking"
          className="w-full h-full absolute z-0 hidden md:block object-cover"
          id="ck"
          ref={ckRef}
          width={1920}
          height={1080}
        />
        <Image
          src="/story/moi-png.png"
          alt="Ck moi"
          className="w-full h-full absolute -z-10 hidden md:block object-cover"
          ref={moiRef}
          width={1536}
          height={1024}
        />

        {/* Mobile walking images */}
        <Image
          src="/story/oat-walking-bg-png-mob.png"
          alt="Goi walking (mob)"
          className="w-full h-full absolute z-10 md:hidden object-cover"
          ref={walkingManMobRef}
          width={1080}
          height={1920}
        />
        <Image
          src="/story/ck-png-mob.png"
          alt="Goi walking (mob)"
          className="w-full h-full absolute z-0 md:hidden object-cover"
          id="ck-mob"
          ref={ckMobRef}
          width={1080}
          height={1920}
        />
        <Image
          src="/story/moi-png-mob.png"
          alt="Ck moi (mob)"
          className="w-full h-full absolute -z-10 md:hidden object-cover"
          ref={moiMobRef}
          width={1080}
          height={1920}
        />
      </div>
      <div
        className="min-h-screen max-w-full bg-gray-100 flex items-center justify-center z-10 overflow-y-hidden overflow-x-hidden"
        id="ck-badge"
      >
        {/* Desktop badge section */}
        <Image
          src="/story/man-ck-badge-png.png"
          alt="Man kuthifying ck badge"
          className="z-0 w-full h-full hidden md:block object-cover"
          id="man-with-badge"
          width={1920}
          height={1080}
        />
        <Image
          src="/story/placement-png.png"
          alt="My goi got placedd!!"
          className="absolute -z-10 w-full h-full hidden md:block object-cover"
          id="placement"
          width={1920}
          height={1080}
        />

        {/* Mobile badge section */}
        <Image
          src="/story/man-ck-badge-png-mob.png"
          alt="Man kuthifying ck badge (mobile)"
          className="z-0 w-full h-full md:hidden object-cover"
          id="man-with-badge-mob"
          width={1080}
          height={1920}
        />
        <Image
          src="/story/placement-png-mob.png"
          alt="My goi got placedd!! (mobile)"
          className="absolute -z-10 w-full h-full md:hidden object-cover"
          id="placement-mob"
          width={1080}
          height={1920}
        />
      </div>
    </div>
  );
}

export default StoryComponent;