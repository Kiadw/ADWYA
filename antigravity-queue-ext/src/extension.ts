import * as vscode from 'vscode';
import { AntigravitySDK } from 'antigravity-sdk';
import * as os from 'os';
import * as path from 'path';

export async function activate(context: vscode.ExtensionContext) {
  const sdk = new AntigravitySDK(context);
  await sdk.initialize();

  // Mac OS path fix for antigravity-sdk (which hardcodes Windows path)
  if (os.platform() === 'darwin') {
    const correctDir = '/Applications/Antigravity.app/Contents/Resources/app/out/vs/code/electron-browser/workbench';
    const patcher = (sdk.integration as any)._patcher;
    const namespace = (sdk.integration as any)._namespace;
    
    patcher._workbenchDir = correctDir;
    patcher._workbenchHtml = path.join(correctDir, 'workbench.html');
    patcher._manifestPath = path.join(correctDir, 'ag-sdk-manifest.json');
    patcher._loaderPath = path.join(correctDir, 'ag-sdk-loader.js');
    patcher._scriptPath = path.join(correctDir, `ag-sdk-${namespace}.js`);
    patcher._heartbeatPath = path.join(correctDir, `ag-sdk-${namespace}-heartbeat`);
    
    (sdk.integration as any)._integrity._workbenchDir = correctDir;
    if ((sdk.integration as any)._titles) {
      (sdk.integration as any)._titles._workbenchDir = correctDir;
    }
  }

  // Intercept the build() method to inject our custom queue script
  const originalBuild = sdk.integration.build.bind(sdk.integration);
  sdk.integration.build = function() {
    let script = originalBuild();
    
    // Custom UI code for Queuing System (runs in renderer)
    const queueCode = `
(function() {
  function initQueue() {
    var ib = document.querySelector('#antigravity\\\\\\\\.agentSidePanelInputBox');
    if (!ib) { setTimeout(initQueue, 1000); return; }
    
    var allBtns = ib.querySelectorAll('button,[role="button"]');
    if (allBtns.length === 0) { setTimeout(initQueue, 1000); return; }
    var btnRow = allBtns[allBtns.length - 1].parentElement;
    if (!btnRow) return;
    
    if (btnRow.querySelector('.ag-queue-btn')) return;

    var queueBtn = document.createElement('div');
    queueBtn.className = 'ag-inp ag-queue-btn';
    queueBtn.textContent = '⏳';
    queueBtn.title = 'Queue Prompt';
    
    window.__agQueueList = window.__agQueueList || [];
    
    function updateQueueBtn() {
      queueBtn.textContent = window.__agQueueList.length > 0 ? '⏳ (' + window.__agQueueList.length + ')' : '⏳';
      queueBtn.style.color = window.__agQueueList.length > 0 ? '#4fc3f7' : '';
    }
    
    queueBtn.addEventListener('click', function() {
      var input = document.querySelector('vscode-textfield');
      if (!input || !input.value) {
        toast('Queue Empty', null, [['Info', 'Type a prompt first']]);
        return;
      }
      window.__agQueueList.push(input.value);
      input.value = '';
      updateQueueBtn();
      toast('Queued', null, [['Items in queue', ''+window.__agQueueList.length]]);
    });
    
    btnRow.insertBefore(queueBtn, btnRow.firstChild);
    updateQueueBtn();
    
    // Background processor
    setInterval(function() {
      if (window.__agQueueList.length === 0) return;
      
      // Check if Antigravity is busy thinking/generating
      var turns = document.querySelector('#conversation .gap-y-3');
      if (turns && turns.lastElementChild) {
        var botResponse = turns.lastElementChild.children[1];
        if (botResponse && botResponse.textContent.includes('Thought')) {
          // If the bot is actively thinking or responding, wait
          var stopBtn = document.querySelector('button[aria-label="Stop Generation"], [title*="Stop"]');
          if (stopBtn) return; // Definitely busy
        }
      }
      
      var sendBtn = null;
      var icons = ib.querySelectorAll('svg');
      icons.forEach(function(svg) {
        // Find the send icon (arrow or similar)
        if (svg.parentElement.tagName === 'BUTTON' && !svg.parentElement.disabled) {
           var title = svg.parentElement.getAttribute('title') || '';
           if (title.toLowerCase().includes('send') || title.includes('Enter')) {
             sendBtn = svg.parentElement;
           }
        }
      });
      
      if (!sendBtn || sendBtn.disabled) return;
      
      var nextPrompt = window.__agQueueList.shift();
      var input = document.querySelector('vscode-textfield');
      input.value = nextPrompt;
      
      // Simulate input event
      input.dispatchEvent(new Event('input', { bubbles: true }));
      
      updateQueueBtn();
      
      setTimeout(function() {
        sendBtn.click();
      }, 100);
      
    }, 2000);
  }
  
  if (document.readyState === 'complete') {
    setTimeout(initQueue, 2000);
  } else {
    window.addEventListener('load', function() { setTimeout(initQueue, 2000); });
  }
})();
`;
    return script + '\\n' + queueCode;
  };

  // We must register at least one integration for build() to be triggered
  sdk.integration.addInputButton('queue_dummy', ' ', 'Dummy');

  // Install the script seamlessly
  await sdk.integration.installSeamless(
    (cmd) => vscode.commands.executeCommand(cmd),
    (msg, ...items) => vscode.window.showInformationMessage(msg, ...items)
  );

  context.subscriptions.push(sdk);
}

export function deactivate() {}
