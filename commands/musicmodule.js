const { Client } = require('discord.js');
const yt = require('ytdl-core');
const tokens = require('./tokens.json');
const client = new Client();
let queue = {};

const commands = {
	  'play': (msg) => {
	  	if (queue[msg.guild.id] === undefined) return msg.channel.sendMessage(`Add some songs to the queue first with ${tokens.prefix}add`);
	  	if (!msg.guild.voiceConnection) return commands.join(msg).then(() => commands.play(msg));
	  	if (queue[msg.guild.id].playing) return msg.channel.sendMessage('Already Playing');
	  	let dispatcher;
	  	queue[msg.guild.id].playing = true;

	  	console.log(queue);
	  	(function play(song) {
	  		console.log(song);
	  		if (song === undefined) return msg.channel.sendMessage('Queue is empty').then(() => {
		  		queue[msg.guild.id].playing = false;
		  		msg.member.voiceChannel.leave();
		  	});
		  	msg.channel.sendMessage(`Playing: **${song.title}** as requested by: **${song.requester}**`);
		  	dispatcher = msg.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), { passes : tokens.passes });
		  	let collector = msg.channel.createCollector(m => m);
		  	collector.on('message', m => {
		  		if (m.content.startsWith(tokens.prefix + 'pause')) {
		 			msg.channel.sendMessage('paused').then(() => {dispatcher.pause();});
			  	} else if (m.content.startsWith(tokens.prefix + 'resume')) {
			  		msg.channel.sendMessage('resumed').then(() => {dispatcher.resume();});
			  	} else if (m.content.startsWith(tokens.prefix + 'skip')){
		  			msg.channel.sendMessage('skipped').then(() => {dispatcher.end();});
		  		} else if (m.content.startsWith('volume+')){
		  			if (Math.round(dispatcher.volume*50) >= 100) return msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
		  			dispatcher.setVolume(Math.min((dispatcher.volume*50 + (2*(m.content.split('+').length-1)))/50,2));
		  			msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
	  			} else if (m.content.startsWith('volume-')){
	  				if (Math.round(dispatcher.volume*50) <= 0) return msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
	  				dispatcher.setVolume(Math.max((dispatcher.volume*50 - (2*(m.content.split('-').length-1)))/50,0));
	  				msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
	  			} else if (m.content.startsWith(tokens.prefix + 'time')){
	  				msg.channel.sendMessage(`time: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)}`);
	  			}
	  		});
	  		dispatcher.on('end', () => {
	  			collector.stop();
	  			play(queue[msg.guild.id].songs.shift());
	  		});
	  		dispatcher.on('error', (err) => {
	  			return msg.channel.sendMessage('error: ' + err).then(() => {
	  				collector.stop();
	  				play(queue[msg.guild.id].songs.shift());
	  			});
	  		});
	  	})(queue[msg.guild.id].songs.shift());
	  },
	  'join': (msg) => {
		  return new Promise((resolve, reject) => {
			  const voiceChannel = msg.member.voiceChannel;
			  if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply('I couldn\'t connect to your voice channel...');
			  voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
		  });
	  },
	  'add': (msg) => {
		  let url = msg.content.split(' ')[1];
		  if (url == '' || url === undefined) return msg.channel.sendMessage(`You must add a YouTube video url, or id after ${tokens.prefix}add`);
		  yt.getInfo(url, (err, info) => {
			  if(err) return msg.channel.sendMessage('Invalid YouTube Link: ' + err);
			  if (!queue.hasOwnProperty(msg.guild.id)) queue[msg.guild.id] = {}, queue[msg.guild.id].playing = false, queue[msg.guild.id].songs = [];
			  queue[msg.guild.id].songs.push({url: url, title: info.title, requester: msg.author.username});
			  msg.channel.sendMessage(`added **${info.title}** to the queue`);
		  });
	  },
	  'queue': (msg) => {
		  if (queue[msg.guild.id] === undefined) return msg.channel.sendMessage(`Add some songs to the queue first with ${tokens.prefix}add`);
		  let tosend = [];
		  queue[msg.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} - Requested by: ${song.requester}`);});
		  msg.channel.sendMessage(`__**${msg.guild.name}'s Music Queue:**__ Currently **${tosend.length}** songs queued ${(tosend.length > 15 ? '*[Only next 15 shown]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
	  },
	  'help': (msg) => {
		  let tosend = ['```xl', tokens.prefix + 'join : "Join Voice channel of msg sender"',	tokens.prefix + 'add : "Add a valid youtube link to the queue"', tokens.prefix + 'queue : "Shows the current queue, up to 15 songs shown."', tokens.prefix + 'play : "Play the music queue if already joined to a voice channel"', '', 'the following commands only function while the play command is running:'.toUpperCase(), tokens.prefix + 'pause : "pauses the music"',	tokens.prefix + 'resume : "resumes the music"', tokens.prefix + 'skip : "skips the playing song"', tokens.prefix + 'time : "Shows the playtime of the song."',	'volume+(+++) : "increases volume by 2%/+"',	'volume-(---) : "decreases volume by 2%/-"',	'```'];
		  msg.channel.sendMessage(tosend.join('\n'));
	  },
  'reboot': (msg) => {
 	if (msg.author.id == tokens.adminID) process.exit(); //Requires a node module like Forever to work.
	  }
};
