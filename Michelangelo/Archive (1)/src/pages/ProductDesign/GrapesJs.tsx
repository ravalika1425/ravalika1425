import axios from "axios";
import grapesjs, { Editor } from "grapesjs";
import basicBlockPlugin from "grapesjs-blocks-basic";
import gjsNav from "grapesjs-navbar";
import exportPlugin from "grapesjs-plugin-export";
import gjsForms from "grapesjs-plugin-forms";
import "grapesjs/dist/css/grapes.min.css";
import { WIREFRAME_EDITOR } from "Mike/constants";
import { GrapesJSProps } from "Mike/models/response";
import { axiosInstance } from "Mike/utils/axiosConfig";
import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { useMsal } from "@azure/msal-react";
import { editWireFrame } from "services/wireFrameGenratorServices";
const GrapesJS: React.FC<GrapesJSProps> = ({
  html,
  cssUrl,
  design,
  setHtml,
  setShowGrapes,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
  const [message, setMessage] = useState<string>("");
  const [apiError, setApiError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [originalHtml] = useState<string>(html);
  const [, setUpdatedHtml] = useState<string>("");
  const { accounts } = useMsal();
  function getScriptContentsFromHTML(htmlString: string) {
    // Create a new DOMParser
    const parser = new DOMParser();
    const htmlcontent = `<!DOCTYPE html>

<html>

  <head>

    <link

      href="https://cdn.jsdelivr.net/gh/sadiqnaizam/css-hosting@main/theme.css"

      rel="stylesheet"

    />

    <script

      crossorigin="anonymous"

      integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="

      src="https://code.jquery.com/jquery-3.7.1.min.js"

    ></script>

    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>

    <script src="https://cdn.jsdelivr.net/gh/sadiqnaizam/css-hosting/dashboard.js"></script>

    <style>

      :root {

        --primary-color: #4a90e2;

        --secondary-color: #99dd4d;

        --tertiary-color: #9013fe;

      }

      * {

        box-sizing: border-box;

        margin: 0;

        padding: 0;

      }

      body, html {

        height: 100%;

        font-family: Arial, sans-serif;

        color: #333;

      }

      .dashboard-container {

        display: flex;

        height: 100vh;

      }

      .sidebar {

        width: 270px;

        background-color: #1f2937; /* Dark gray background */

        color: white;

        overflow-y: auto; /* Enable vertical scrolling */

        position: fixed; /* Fix the sidebar */

        top: 0;

        left: 0;

        height: 100%;

        transition: width 0.3s ease, transform 0.3s ease;

      }

      .main-content {

        margin-left: 270px; /* Adjust for sidebar width */

        flex: 1;

        display: flex;

        flex-direction: column;

        overflow-y: auto; /* Enable vertical scrolling */

        transition: margin-left 0.3s ease;

      }

      a {

        color: var(--secondary-color);

        text-decoration: none;

      }

      .footer {

        background-color: var(--tertiary-color);

        color: white;

      }

      .sidebar-nav ul {

        list-style: none;

      }

      .sidebar-link {

        display: flex;

        align-items: center;

        gap: 12px;

        padding: 10px 15px;

        color: #d1d5db; /* Light gray text */

        transition: all 0.3s ease;

      }

      .sidebar-link:hover {

        background-color: rgba(255,255,255,0.1);

        color: white;

      }

      section {

        padding: 2rem;

      }

      .toggle-button {

        display: none;

        background-color: var(--primary-color);

        color: white;

        padding: 10px;

        cursor: pointer;

        position: fixed;

        top: 10px;

        left: 10px;

        z-index: 1000;

      }

      @media (max-width: 768px) {

        .sidebar {

          transform: translateX(-100%);

        }

        .main-content {

          margin-left: 0;

        }

        .toggle-button {

          display: block;

        }

        .sidebar.open {

          transform: translateX(0);

        }

      }

    </style>

  </head>

  <body>

    <div class="dashboard-container">

      <!-- Sidebar Toggle Button -->

      <div class="toggle-button" id="toggleButton">

        &#9776;

      </div>



      <!-- Sidebar -->

      <aside class="sidebar" id="sidebar">

        <div class="px-6 mt-8">

          <nav class="w-full flex flex-col sidebar-nav">

            <ul class="text-sm" id="sidebarnav">

              <li class="text-xs font-bold pb-4">

                <span> DASHBOARD </span>

              </li>

              <li class="sidebar-item">

                <a

                  class="sidebar-link"

                  href="./index.html"

                >

                  <i class="ti ti-layout-dashboard text-xl"> </i>

                  <span> Overview </span>

                </a>

              </li>

              <li class="sidebar-item">

                <a

                  class="sidebar-link"

                  href="./stats.html"

                >

                  <i class="ti ti-chart-bar text-xl"> </i>

                  <span> Stats </span>

                </a>

              </li>

              <li class="text-xs font-bold mb-4 mt-8">

                <span> TRANSACTIONS </span>

              </li>

              <li class="sidebar-item">

                <a

                  class="sidebar-link"

                  href="./recent.html"

                >

                  <i class="ti ti-clock text-xl"> </i>

                  <span> Recent </span>

                </a>

              </li>

              <li class="sidebar-item">

                <a

                  class="sidebar-link"

                  href="./history.html"

                >

                  <i class="ti ti-history text-xl"> </i>

                  <span> History </span>

                </a>

              </li>

              <li class="text-xs font-bold mb-4 mt-8">

                <span> ACCOUNTS </span>

              </li>

              <li class="sidebar-item">

                <a

                  class="sidebar-link"

                  href="./savings.html"

                >

                  <i class="ti ti-piggy-bank text-xl"> </i>

                  <span> Savings </span>

                </a>

              </li>

              <li class="sidebar-item">

                <a

                  class="sidebar-link"

                  href="./checking.html"

                >

                  <i class="ti ti-wallet text-xl"> </i>

                  <span> Checking </span>

                </a>

              </li>

              <li class="text-xs font-bold mb-4 mt-8">

                <span> TRANSFER </span>

              </li>

              <li class="sidebar-item">

                <a

                  class="sidebar-link"

                  href="./pages/authentication-login.html"

                >

                  <i class="ti ti-login text-xl"> </i>

                  <span> Internal Transfers </span>

                </a>

              </li>

              <li class="sidebar-item">

                <a

                  class="sidebar-link"

                  href="./pages/authentication-register.html"

                >

                  <i class="ti ti-user-plus text-xl"> </i>

                  <span> External Transfers </span>

                </a>

              </li>

              <li class="text-xs font-bold mb-4 mt-8">

                <span> SETTINGS </span>

              </li>

              <li class="sidebar-item">

                <a

                  class="sidebar-link"

                  href="./pages/icons.html"

                >

                  <i class="ti ti-mood-happy text-xl"> </i>

                  <span> Profile </span>

                </a>

              </li>

              <li class="sidebar-item">

                <a

                  class="sidebar-link"

                  href="./pages/sample-page.html"

                >

                  <i class="ti ti-aperture text-xl"> </i>

                  <span> Security </span>

                </a>

              </li>

            </ul>

          </nav>

        </div>

      </aside>



      <div class="main-content">

        <!-- Header -->

        <header

          class="bg-gray-700 text-white p-4 flex justify-between items-center"

        >

          <div

            style="

              padding: 10px;

              text-align: center;

              background-color: var(--primary-color);

            "

          >

            <img

              alt="Brand Logo"

              src="https://99designs-blog.imgix.net/blog/wp-content/uploads/2022/06/630fd95f-7791-4236-a408-5dd739617608-e1657198163792.png?auto=format&q=60&fit=max&w=930"

              style="max-height: 50px"

            />

          </div>

        </header>



        <!-- Footer -->

        <section class="bg-gray-100 p-8 unrecognized">

          <div

            class="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-6 gap-x-0 lg:gap-y-0 gap-y-6"

          >

            <div class="card">

              <div class="card-body">

                <h4 class="text-gray-600 text-lg font-semibold mb-6">

                  Recent Activity

                </h4>

                <ul class="timeline-widget relative">

                  <li

                    class="timeline-item flex relative overflow-hidden min-h-[70px]"

                  >

                    <div

                      class="timeline-time text-gray-600 text-sm min-w-[90px] py-[6px] pr-4 text-end"

                    >

                      9:30 am

                    </div>

                    <div class="timeline-badge-wrap flex flex-col items-center">

                      <div

                        class="timeline-badge w-3 h-3 rounded-full shrink-0 bg-transparent border-2 border-blue-600 my-[10px]"

                      ></div>

                      <div

                        class="timeline-badge-border block h-full w-[1px] bg-gray-100"

                      ></div>

                    </div>

                    <div class="timeline-desc py-[6px] px-4">

                      <p class="text-gray-600 text-sm font-normal">

                        Payment received from John Doe of $385.90

                      </p>

                    </div>

                  </li>

                  <li

                    class="timeline-item flex relative overflow-hidden min-h-[70px]"

                  >

                    <div

                      class="timeline-time text-gray-600 min-w-[90px] py-[6px] text-sm pr-4 text-end"

                    >

                      10:00 am

                    </div>

                    <div class="timeline-badge-wrap flex flex-col items-center">

                      <div

                        class="timeline-badge w-3 h-3 rounded-full shrink-0 bg-transparent border-2 border-blue-300 my-[10px]"

                      ></div>

                      <div

                        class="timeline-badge-border block h-full w-[1px] bg-gray-100"

                      ></div>

                    </div>

                    <div class="timeline-desc py-[6px] px-4 text-sm">

                      <p class="text-gray-600 font-semibold">

                        Update your profile

                      </p>

                    </div>

                  </li>

                  <li

                    class="timeline-item flex relative overflow-hidden min-h-[70px]"

                  >

                    <div

                      class="timeline-time text-gray-600 min-w-[90px] text-sm py-[6px] pr-4 text-end"

                    >

                      12:00 am

                    </div>

                    <div class="timeline-badge-wrap flex flex-col items-center">

                      <div

                        class="timeline-badge w-3 h-3 rounded-full shrink-0 bg-transparent border-2 border-teal-500 my-[10px]"

                      ></div>

                      <div

                        class="timeline-badge-border block h-full w-[1px] bg-gray-100"

                      ></div>

                    </div>

                    <div class="timeline-desc py-[6px] px-4">

                      <p class="text-gray-600 text-sm font-normal">

                        Payment was made of $64.95 to Michael

                      </p>

                    </div>

                  </li>

                  <li

                    class="timeline-item flex relative overflow-hidden min-h-[70px]"

                  >

                    <div

                      class="timeline-time text-gray-600 min-w-[90px] text-sm py-[6px] pr-4 text-end"

                    >

                      9:30 am

                    </div>

                    <div class="timeline-badge-wrap flex flex-col items-center">

                      <div

                        class="timeline-badge w-3 h-3 rounded-full shrink-0 bg-transparent border-2 border-yellow-500 my-[10px]"

                      ></div>

                      <div

                        class="timeline-badge-border block h-full w-[1px] bg-gray-100"

                      ></div>

                    </div>

                    <div class="timeline-desc py-[6px] px-4 text-sm">

                      <p class="text-gray-600 font-semibold">

                        Viewed recent transactions

                      </p>

                    </div>

                  </li>

                  <li

                    class="timeline-item flex relative overflow-hidden min-h-[70px]"

                  >

                    <div

                      class="timeline-time text-gray-600 text-sm min-w-[90px] py-[6px] pr-4 text-end"

                    >

                      9:30 am

                    </div>

                    <div class="timeline-badge-wrap flex flex-col items-center">

                      <div

                        class="timeline-badge w-3 h-3 rounded-full shrink-0 bg-transparent border-2 border-red-500 my-[10px]"

                      ></div>

                      <div

                        class="timeline-badge-border block h-full w-[1px] bg-gray-100"

                      ></div>

                    </div>

                    <div class="timeline-desc py-[6px] px-4">

                      <p class="text-gray-600 text-sm font-semibold">

                        Payment Done

                      </p>

                    </div>

                  </li>

                  <li class="timeline-item flex relative overflow-hidden">

                    <div

                      class="timeline-time text-gray-600 text-sm min-w-[90px] py-[6px] pr-4 text-end"

                    >

                      12:00 am

                    </div>

                    <div class="timeline-badge-wrap flex flex-col items-center">

                      <div

                        class="timeline-badge w-3 h-3 rounded-full shrink-0 bg-transparent border-2 border-teal-500 my-[10px]"

                      ></div>

                      <div

                        class="timeline-badge-border block h-full w-[1px] bg-gray-100"

                      ></div>

                    </div>

                    <div class="timeline-desc py-[6px] px-4">

                      <p class="text-gray-600 text-sm font-normal">

                        Payment Done

                      </p>

                    </div>

                  </li>

                </ul>

              </div>

            </div>

            <div class="col-span-2">

              <div class="card h-full">

                <div class="card-body">

                  <h4 class="text-gray-600 text-lg font-semibold mb-6">

                    Recent Transaction

                  </h4>

                  <div class="relative overflow-x-auto">

                    <!-- table -->

                    <table class="text-left w-full whitespace-nowrap text-sm">

                      <thead class="text-gray-700">

                        <tr class="font-semibold text-gray-600">

                          <th class="p-4" scope="col">Id</th>

                          <th class="p-4" scope="col">Account</th>

                          <th class="p-4" scope="col">Currency Type</th>

                          <th class="p-4" scope="col">Transaction Type</th>

                          <th class="p-4" scope="col">Amount</th>

                        </tr>

                      </thead>

                      <tbody>

                        <tr>

                          <td class="p-4 font-semibold text-gray-600">1</td>

                          <td class="p-4">

                            <div class="flex flex-col gap-1">

                              <h3 class="font-semibold text-gray-600">

                                Sunil Joshi

                              </h3>

                            </div>

                          </td>

                          <td class="p-4">

                            <span class="font-normal text-gray-500"> USD </span>

                          </td>

                          <td class="p-4">

                            <span

                              class="inline-flex items-center py-[3px] px-[10px] rounded-2xl font-semibold bg-blue-600 text-white"

                            >

                              Deposit

                            </span>

                          </td>

                          <td class="p-4">

                            <span class="font-semibold text-base text-gray-600">

                              $3.9

                            </span>

                          </td>

                        </tr>

                        <tr>

                          <td class="p-4 font-semibold text-gray-600">2</td>

                          <td class="p-4">

                            <div class="flex flex-col gap-1">

                              <h3 class="font-semibold text-gray-600">

                                Andrew McDownland

                              </h3>

                            </div>

                          </td>

                          <td class="p-4">

                            <span class="font-normal text-gray-500"> EUR </span>

                          </td>

                          <td class="p-4">

                            <span

                              class="inline-flex items-center py-[3px] px-[10px] rounded-2xl font-semibold text-white bg-cyan-500"

                            >

                              Withdrawal

                            </span>

                          </td>

                          <td class="p-4">

                            <span class="font-semibold text-base text-gray-600">

                              €24.5k

                            </span>

                          </td>

                        </tr>

                        <tr>

                          <td class="p-4 font-semibold text-gray-600">3</td>

                          <td class="p-4">

                            <div class="flex flex-col gap-1">

                              <h3 class="font-semibold text-gray-600">

                                Christopher Jamil

                              </h3>

                            </div>

                          </td>

                          <td class="p-4">

                            <span class="font-normal text-gray-500"> EUR </span>

                          </td>

                          <td class="p-4">

                            <span

                              class="inline-flex items-center py-[3px] px-[10px] rounded-2xl font-semibold bg-blue-600 text-white"

                            >

                              Deposit

                            </span>

                          </td>

                          <td class="p-4">

                            <span class="font-semibold text-base text-gray-600">

                              €12.8k

                            </span>

                          </td>

                        </tr>

                        <tr>

                          <td class="p-4 font-semibold text-gray-600">4</td>

                          <td class="p-4">

                            <div class="flex flex-col gap-1">

                              <h3 class="font-semibold text-gray-600">

                                Nirav Joshi

                              </h3>

                            </div>

                          </td>

                          <td class="p-4">

                            <span class="font-normal text-sm text-gray-500">

                              USD

                            </span>

                          </td>

                          <td class="p-4">

                            <span

                              class="inline-flex items-center py-[3px] px-[10px] rounded-2xl font-semibold text-white bg-teal-500"

                            >

                              Transfer

                            </span>

                          </td>

                          <td class="p-4">

                            <span class="font-semibold text-base text-gray-600">

                              $2.4k

                            </span>

                          </td>

                        </tr>

                      </tbody>

                    </table>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        <section class="bg-gray-100 p-8 unrecognized">

          <div

            class="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-6 gap-x-0 lg:gap-y-0 gap-y-6"

          >

            <div class="col-span-2">

              <div class="card">

                <div class="card-body">

                  <div class="sm:flex block justify-between mb-5">

                    <h4 class="text-gray-600 text-lg font-semibold sm:mb-0 mb-2">

                      Account Balances

                    </h4>

                    <select

                      class="border-gray-400 text-gray-500 rounded-md text-sm border-[1px] focus:ring-0 sm:w-auto w-full"

                      id="cars"

                      name="cars"

                    >

                      <option value="volvo">March2023</option>

                      <option value="saab">April2023</option>

                      <option value="mercedes">May2023</option>

                      <option value="audi">June2023</option>

                    </select>

                  </div>

                  <div id="chart">

                    <!-- Missing PieChart element added -->

                    <piechart label="Account Balances"> </piechart>

                  </div>

                </div>

              </div>

            </div>

            <div class="flex flex-col gap-6">

              <div class="card">

                <div class="card-body">

                  <h4 class="text-gray-600 text-lg font-semibold mb-5">

                    Yearly Breakup

                  </h4>

                  <div class="flex gap-6 items-center justify-between">

                    <div class="flex flex-col gap-4">

                      <h3 class="text-[21px] font-semibold text-gray-600">

                        $36,358

                      </h3>

                      <div class="flex items-center gap-1">

                        <span

                          class="flex items-center justify-center w-5 h-5 rounded-full bg-teal-400"

                        >

                          <i class="ti ti-arrow-up-left text-teal-500"> </i>

                        </span>

                        <p class="text-gray-600 text-sm font-normal">+9%</p>

                        <p class="text-gray-500 text-sm font-normal text-nowrap">

                          last year

                        </p>

                      </div>

                      <div class="flex">

                        <div class="flex gap-2 items-center">

                          <span class="w-2 h-2 rounded-full bg-blue-600"> </span>

                          <p class="text-gray-500 font-normal text-xs">2023</p>

                        </div>

                        <div class="flex gap-2 items-center">

                          <span class="w-2 h-2 rounded-full bg-blue-500"> </span>

                          <p class="text-gray-500 font-normal text-xs">2023</p>

                        </div>

                      </div>

                    </div>

                    <div class="flex items-center">

                      <div id="breakup"></div>

                    </div>

                  </div>

                </div>

              </div>

              <div class="card">

                <div class="card-body">

                  <div class="flex gap-6 items-center justify-between">

                    <div class="flex flex-col gap-5">

                      <h4 class="text-gray-600 text-lg font-semibold">

                        Monthly Expenses

                      </h4>

                      <div class="flex flex-col gap-[18px]">

                        <h3 class="text-[21px] font-semibold text-gray-600">

                          $6,820

                        </h3>

                        <div class="flex items-center gap-1">

                          <span

                            class="flex items-center justify-center w-5 h-5 rounded-full bg-red-400"

                          >

                            <i class="ti ti-arrow-down-right text-red-500"> </i>

                          </span>

                          <p class="text-gray-600 text-sm font-normal">+9%</p>

                          <p class="text-gray-500 text-sm font-normal">

                            last year

                          </p>

                        </div>

                      </div>

                    </div>

                    <div

                      class="w-11 h-11 flex justify-center items-center rounded-full bg-cyan-500 text-white self-start"

                    >

                      <i class="ti ti-currency-dollar text-xl"> </i>

                    </div>

                  </div>

                </div>

                <div id="earning"></div>

              </div>

            </div>

          </div>

        </section>

        <footer class="bg-gray-700 text-white p-4 mt-auto">

          <div class="flex flex-col md:flex-row justify-between items-center">

            <footer>

              <p class="text-base text-gray-500 font-normal p-3 text-center">

                © 2023 Digital Wallet App. All rights reserved.

                <a

                  class="text-blue-600 underline hover:text-blue-700"

                  href=""

                  target="_blank"

                >

                  MagicBank.com

                </a>

              </p>

            </footer>

          </div>

        </footer>

      </div>

    </div>

    <script>

      document.addEventListener('DOMContentLoaded', function() {

        const sidebar = document.getElementById('sidebar');

        const toggleButton = document.getElementById('toggleButton');



        toggleButton.addEventListener('click', function() {

          sidebar.classList.toggle('open');

        });



        const sidebarLinks = document.querySelectorAll('.sidebar-link');

        sidebarLinks.forEach(link => {

          link.addEventListener('click', function() {

            if (window.innerWidth <= 768) {

              sidebar.classList.remove('open');

            }

          });

        });

      });

    </script>

  </body>

</html>`;
    // Parse the HTML string into a document
    const doc = parser.parseFromString(htmlString, "text/html");

    // Select all script tags in the parsed document
    const scriptTags = doc.querySelectorAll("script");

    // Initialize an empty string to hold the concatenated contents
    let scriptContents = "";

    // Loop through all script tags and concatenate their contents
    scriptTags.forEach((script) => {
      scriptContents += script.innerHTML;
    });

    return scriptContents;
  }

  useEffect(() => {
    const editor = grapesjs.init({
      container: "#gjs",
      fromElement: true,
      height: "80vh",
      width: "auto",
      jsInHtml: true,
      canvas: {
        scripts: [
          "https://unpkg.com/tailwindcss-cdn@3.4.3/tailwindcss-with-all-plugins.js",
          "https://cdn.jsdelivr.net/npm/apexcharts",
        ],
      },
      storageManager: false,
      plugins: [exportPlugin, basicBlockPlugin, gjsForms, gjsNav],
    });

    setEditorInstance(editor);

    editor.BlockManager.add("my-block-id", {
      label: "My Block",
      content: '<div class="my-block">This is my block content</div>',
      category: "Custom",
    });

    editor.Commands.add("add-blocks", {
      run: (editor) => {
        editor.BlockManager.add("my-block-id", {
          label: "My Block",
          content: '<div class="my-block">This is my block content</div>',
          category: "Custom",
        });
      },
    });

    editor.runCommand("add-blocks");

    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (editorInstance) {
      editorInstance.setComponents(html);
      const htmlScripts = getScriptContentsFromHTML(html);
      editorInstance.on("load", () => {
        const scriptContent = htmlScripts;
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.innerHTML = scriptContent;
        editorInstance.Canvas.getBody().appendChild(script);
      });
    }
  }, [html, cssUrl, editorInstance]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  console.log("Original HTML Content:", originalHtml);

  const extractHtmlContent = (html: string): string => {
    const match = html.match(/<!DOCTYPE html>[\s\S]*<\/html>/i);
    return match ? match[0] : "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    console.log("Handle Click Prompt Refined");

    const apiPayload = {
      userSignature: accounts[0].username,
      prompt: `${message}\nHere is my previously generated HTML code:\n${html}\nMake the change as suggested and provide the complete updated HTML.`,
    };
    setIsLoading(true);

    try {
      // const response = await axiosInstance.post(
      //   WIREFRAME_EDITOR,
      //   apiPayload
      // );
      const response = await editWireFrame(apiPayload);
      if (response.data.status_code === 200) {
        const newPrompt = response.data.code;
        console.log("Response from Grape Js editor:", newPrompt);
        const updatedHtmlContent = extractHtmlContent(newPrompt);
        console.log("Updated HTML Content:", updatedHtmlContent);

        if (editorInstance) {
          editorInstance.setComponents(updatedHtmlContent);
        }
        setUpdatedHtml(updatedHtmlContent);
      } else {
        setApiError("No HTML content received from the API");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error in API call:", error.message);
        if (error.response) {
          console.error("Error status:", error.response.status);
          console.error("Error data:", error.response.data);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    setShowGrapes(false);
  };

  function replaceBodyContent(A: string, B: string) {
    // Create a DOM parser to parse the HTML strings
    const parser = new DOMParser();

    // Parse the full HTML (A)
    const docA = parser.parseFromString(A, "text/html");

    // Parse the body HTML (B)
    const docB = parser.parseFromString(B, "text/html");

    // Replace the body of A with the body of B
    docA.body.innerHTML = docB.body.innerHTML;

    // Return the modified HTML as a string
    return docA.documentElement.outerHTML;
  }

  const handleSave = () => {
    if (editorInstance)
      setHtml(() => ({
        design: design,
        code: replaceBodyContent(html, editorInstance.getHtml()),
      }));
    console.log("The saced code:", editorInstance?.getHtml());
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Row className="my-1">
          <Col xs="auto">
            <i
              aria-label="back buttton"
              className="px-3 py-3 mx-2 ri-arrow-left-line rounded-pill shadow-lg back-btn"
              onClick={handleBackClick}
              style={{ cursor: "pointer" }}
            ></i>
          </Col>
        </Row>
        <Button onClick={handleSave}> Save</Button>
        <div id="gjs" ref={editorRef}>
          <h1>Hello michelangelo</h1>
        </div>

        <div className="chat-input-section p-3 p-lg-4">
          <form id="chatinput-form" onSubmit={handleSubmit}>
            <Row className="g-0 align-items-center">
              <div className="col-auto">
                <div className="chat-input-links me-2"></div>
              </div>
              <div className="col">
                <div className="chat-input-feedback">
                  Please Enter a Message
                </div>
                <input
                  type="text"
                  value={message}
                  onChange={handleInputChange}
                  className="form-control chat-input bg-light border-light"
                  id="chat-input"
                  placeholder="Type your message..."
                />
              </div>
              <div className="col-auto">
                <div className="chat-input-links ms-2">
                  <div className="links-list-item">
                    <button
                      type="submit"
                      className="btn btn-success chat-send waves-effect waves-light"
                    >
                      <i className="ri-send-plane-2-fill align-bottom"></i>
                    </button>
                  </div>
                </div>
              </div>
            </Row>
          </form>
        </div>
        {apiError && (
          <div className="api-error mt-3">
            <h4>Error:</h4>
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {apiError}
            </pre>
          </div>
        )}
      </div>
      <Modal isOpen={isLoading} centered>
        <ModalHeader className="modal-title">Fixing your design</ModalHeader>
        <ModalBody className="modal-body text-center p-5">
          <div className="mt-4">
            <p className="text-muted mb-4">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="">Please wait while we fix your design</p>
            </p>
            <div className="hstack gap-2 justify-content-center">
              <Button color="light">Cancel</Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default GrapesJS;
