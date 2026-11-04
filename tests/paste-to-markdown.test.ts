import test from "node:test";
import assert from "node:assert/strict";
import { htmlToMarkdown } from "../lib/paste-to-markdown";

test("Google Docs: headings, bold, italic, links, lists, and the fake bold wrapper", () => {
  const html = `<meta charset='utf-8'><meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-1234-5678">
    <h2 dir="ltr"><span style="font-size:17pt;font-weight:400;">A heading</span></h2>
    <p dir="ltr"><span style="font-weight:400;">Plain </span><span style="font-weight:700;">bold</span><span style="font-weight:400;"> and </span><span style="font-style:italic;font-weight:400;">italic</span><span style="font-weight:400;"> text.</span></p>
    <ul><li dir="ltr"><p dir="ltr"><span>First</span></p></li><li dir="ltr"><p dir="ltr"><span>Second</span></p></li></ul>
    <p dir="ltr"><a href="https://example.com/page"><span style="text-decoration:underline;">a link</span></a></p>
  </b>`;
  const { markdown } = htmlToMarkdown(html);
  assert.match(markdown, /^## A heading$/m);
  assert.match(markdown, /Plain \*\*bold\*\* and \*italic\* text\./);
  assert.match(markdown, /^- First$/m);
  assert.match(markdown, /^- Second$/m);
  assert.match(markdown, /\[a link\]\(https:\/\/example\.com\/page\)/);
  // The wrapper must not turn the whole document bold.
  assert.doesNotMatch(markdown, /\*\*Plain/);
});

test("Word: bullets and numbers typed in as text become real lists, with nesting", () => {
  const html = `<html><head><style>p.MsoNormal{margin:0}</style></head><body>
    <!--StartFragment-->
    <p class=MsoNormal>Intro paragraph<o:p></o:p></p>
    <p class=MsoListParagraphCxSpFirst style='mso-list:l0 level1 lfo1'><![if !supportLists]><span style='mso-list:Ignore'>·<span>&nbsp;&nbsp;&nbsp;&nbsp;</span></span><![endif]>Apples<o:p></o:p></p>
    <p class=MsoListParagraphCxSpMiddle style='mso-list:l0 level2 lfo1'><![if !supportLists]><span style='mso-list:Ignore'>o<span>&nbsp;&nbsp;</span></span><![endif]>Granny Smith<o:p></o:p></p>
    <p class=MsoListParagraphCxSpLast style='mso-list:l0 level1 lfo1'><![if !supportLists]><span style='mso-list:Ignore'>·<span>&nbsp;&nbsp;&nbsp;&nbsp;</span></span><![endif]>Pears<o:p></o:p></p>
    <p class=MsoListParagraphCxSpFirst style='mso-list:l1 level1 lfo2'><span style='mso-list:Ignore'>1.<span>&nbsp;&nbsp;</span></span>Plan<o:p></o:p></p>
    <p class=MsoListParagraphCxSpLast style='mso-list:l1 level1 lfo2'><span style='mso-list:Ignore'>2.<span>&nbsp;&nbsp;</span></span>Execute<o:p></o:p></p>
    <!--EndFragment--></body></html>`;
  const { markdown } = htmlToMarkdown(html);
  assert.match(markdown, /Intro paragraph/);
  assert.match(markdown, /^- Apples$/m);
  assert.match(markdown, /^  - Granny Smith$/m);
  assert.match(markdown, /^- Pears$/m);
  assert.match(markdown, /^1\. Plan$/m);
  assert.match(markdown, /^2\. Execute$/m);
  assert.doesNotMatch(markdown, /mso|StartFragment/i);
});

test("Ordinary web page HTML converts cleanly", () => {
  const { markdown } = htmlToMarkdown(
    `<h1>Title</h1><p>Para with <strong>bold</strong>, <em>italic</em> and <a href="https://x.test">a link</a>.</p><blockquote><p>A quote</p></blockquote><hr><ol><li>One</li><li>Two</li></ol>`
  );
  assert.match(markdown, /^# Title$/m);
  assert.match(markdown, /Para with \*\*bold\*\*, \*italic\* and \[a link\]\(https:\/\/x\.test\)\./);
  assert.match(markdown, /^> A quote$/m);
  assert.match(markdown, /^---$/m);
  assert.match(markdown, /^1\. One$/m);
});

test("Images are dropped and counted; stray spaces and blank paragraphs are tidied", () => {
  const { markdown, droppedImages } = htmlToMarkdown(
    `<p>Before</p><p><img src="file:///C:/pic.png"></p><p>&nbsp;</p><p>&nbsp;</p><p>After&nbsp;this\u200b</p>`
  );
  assert.equal(droppedImages, 1);
  assert.doesNotMatch(markdown, /pic\.png|!\[/);
  assert.doesNotMatch(markdown, /\n{3,}/);
  assert.match(markdown, /After this/);
});

test("Bold spans keep surrounding spaces outside the markers", () => {
  const { markdown } = htmlToMarkdown(
    `<p>one<span style="font-weight:700"> two </span>three</p>`
  );
  assert.equal(markdown, "one **two** three");
});

test("Script and style content never leaks into the text", () => {
  const { markdown } = htmlToMarkdown(
    `<style>body{color:red}</style><script>alert(1)</script><p>Safe</p>`
  );
  assert.equal(markdown, "Safe");
});
