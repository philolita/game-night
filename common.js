const Net={conn:null,peer:null,
init(o){Net.o=o;const J=new URLSearchParams(location.search).get("join");
 if(J)Net.guest(J);else o.box.innerHTML='<button onclick="Net.host()">Create online game</button><button onclick="Net.o.setMe(null);Net.o.box.innerHTML=\'\'">Same screen</button>'},
wire(c,role){Net.conn=c;
 c.on("open",()=>{Net.o.setMe(role);Net.o.status(role?"Connected! You are Player 2 (blue).":"Friend connected! You are Player 1 (pink).");Net.o.box.innerHTML="";if(!role)Net.send()});
 c.on("data",d=>{if(d&&d.seq>Net.o.get().seq){Net.o.set(d);Net.o.render()}});
 c.on("close",()=>Net.o.status("Connection lost. Refresh to reconnect."))},
host(){Net.o.status("Setting up…");Net.peer=new Peer();
 Net.peer.on("open",id=>{const u=location.origin+location.pathname+"?join="+id;
  Net.o.box.innerHTML='<p>Send this link to your friend and keep this page open:</p><input id="lk" readonly style="width:90%;padding:8px" value="'+u+'"><br><button onclick="navigator.clipboard.writeText(document.getElementById(\'lk\').value)">Copy link</button>';
  Net.o.status("Waiting for your friend to open the link…")});
 Net.peer.on("connection",c=>Net.wire(c,0));
 Net.peer.on("error",e=>Net.o.status("Network error: "+e.type))},
guest(id){Net.o.status("Connecting…");Net.peer=new Peer();
 Net.peer.on("open",()=>Net.wire(Net.peer.connect(id,{reliable:true}),1));
 Net.peer.on("error",e=>Net.o.status("Could not connect: "+e.type+". Ask for a new link."))},
send(){const S=Net.o.get();S.seq++;if(Net.conn&&Net.conn.open)Net.conn.send(S)}};
