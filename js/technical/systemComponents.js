// noinspection SpellCheckingInspection
const systemComponents = {
	"tab-buttons": {
		props: ["layer", "data", "name"],
		template: `
          <div class="upgRow">
          <div v-for="tab in Object.keys(data)">
            <button v-if="data[tab].unlocked === undefined || data[tab].unlocked"
                    v-bind:class="{tabButton: true, notify: subtabShouldNotify(layer, name, tab), resetNotify: subtabResetNotify(layer, name, tab)}"
                    v-bind:style="[{'border-color': tmp[layer].color}, (data[tab].glowColor && subtabShouldNotify(layer, name, tab) ? {'box-shadow': 'var(--hqProperty2a), 0 0 20px '  + data[tab].glowColor} : {}), tmp[layer].componentStyles['tab-button'], data[tab].buttonStyle]"
                    v-on:click="function(){player.subtabs[layer][name] = tab; updateTabFormats(); needCanvasUpdate = true;}">{{ tab }}
            </button>
          </div>
          </div>
		`
	},

	"tree-node": {
		props: ["layer", "abb", "size"],
		template: `
		<button v-if="nodeShown(layer)"
			v-bind:id="layer"
			v-on:click="function() {
				if (shiftDown) player[layer].forceTooltip = !player[layer].forceTooltip
				else if(tmp[layer].isLayer) {showTab(layer)}
				else {run(layers[layer].onClick, layers[layer])}
			}"


			v-bind:class="{
				treeNode: tmp[layer].isLayer,
				treeButton: !tmp[layer].isLayer,
				smallNode: size === 'small',
				[layer]: true,
				tooltipBox: true,
				forceTooltip: player[layer].forceTooltip,
				ghost: tmp[layer].layerShown == 'ghost',
				hidden: !tmp[layer].layerShown,
				locked: tmp[layer].isLayer ? !(player[layer].unlocked || tmp[layer].canReset) : !(tmp[layer].canClick),
				notify: tmp[layer].notify && player[layer].unlocked,
				resetNotify: tmp[layer].prestigeNotify,
				can: ((player[layer].unlocked || tmp[layer].isLayer) && tmp[layer].isLayer) || (!tmp[layer].isLayer && tmp[layer].canClick),
			}"
			v-bind:style="constructNodeStyle(layer)">
			<span v-html="(abb !== '' && tmp[layer].image === undefined) ? abb : '&nbsp;'"></span>
			<tooltip
      v-if="tmp[layer].tooltip != ''"
			:text="(tmp[layer].isLayer) ? (
				player[layer].unlocked ? (tmp[layer].tooltip ? tmp[layer].tooltip : formatWhole(player[layer].points) + ' ' + tmp[layer].resource)
				: (tmp[layer].tooltipLocked ? tmp[layer].tooltipLocked : 'Reach ' + formatWhole(tmp[layer].requires) + ' ' + tmp[layer].baseResource + ' to unlock (You have ' + formatWhole(tmp[layer].baseAmount) + ' ' + tmp[layer].baseResource + ')')
			)
			: (
				tmp[layer].canClick ? (tmp[layer].tooltip ? tmp[layer].tooltip : 'I am a button!')
				: (tmp[layer].tooltipLocked ? tmp[layer].tooltipLocked : 'I am a button!')
			)"></tooltip>
			<node-mark :layer='layer' :data='layers[layer].marked'></node-mark></span>
		</button>
		`
	},


	"layer-tab": {
		props: ["layer", "back", "spacing", "embedded"],
		template: `
          <div
              v-bind:style="[tmp[layer].style ? tmp[layer].style : {}, (tmp[layer].tabFormat && !Array.isArray(tmp[layer].tabFormat)) ? tmp[layer].tabFormat[player.subtabs[layer].mainTabs].style : {}]">
          <div v-if="back" style="position: fixed; z-index: 100;">
            <button v-bind:class="back === 'big' ? 'other-back' : 'back'" v-on:click="goBack()">←</button>
          </div>
          <div v-if="!tmp[layer].tabFormat">
            <div v-if="spacing" v-bind:style="{'height': spacing}" :key="this.$vnode.key + '-spacing'"></div>
            <infobox v-if="tmp[layer].infoboxes" :layer="layer" :data="Object.keys(tmp[layer].infoboxes)[0]"
                     :key="this.$vnode.key + '-info'"></infobox>
            <main-display v-bind:style="tmp[layer].componentStyles['main-display']" :layer="layer"></main-display>
            <div v-if="tmp[layer].type !== 'none'">
              <prestige-button v-bind:style="tmp[layer].componentStyles['prestige-button']"
                               :layer="layer"></prestige-button>
            </div>
            <resource-display v-bind:style="tmp[layer].componentStyles['resource-display']"
                              :layer="layer"></resource-display>
            <milestones v-bind:style="tmp[layer].componentStyles.milestones" :layer="layer"></milestones>
            <div v-if="Array.isArray(tmp[layer].midsection)">
              <column :layer="layer" :data="tmp[layer].midsection" :key="this.$vnode.key + '-mid'"></column>
            </div>
            <clickables v-bind:style="tmp[layer].componentStyles['clickables']" :layer="layer"></clickables>
            <buyables v-bind:style="tmp[layer].componentStyles.buyables" :layer="layer"></buyables>
            <upgrades v-bind:style="tmp[layer].componentStyles['upgrades']" :layer="layer"></upgrades>
            <challenges v-bind:style="tmp[layer].componentStyles['challenges']" :layer="layer"></challenges>
            <achievements v-bind:style="tmp[layer].componentStyles.achievements" :layer="layer"></achievements>
            <br><br>
          </div>
          <div v-if="tmp[layer].tabFormat">
            <div v-if="Array.isArray(tmp[layer].tabFormat)">
              <div v-if="spacing" v-bind:style="{'height': spacing}"></div>
              <column :layer="layer" :data="tmp[layer].tabFormat" :key="this.$vnode.key + '-col'"></column>
            </div>
            <div v-else>
              <div class="upgTable"
                   v-bind:style="{'padding-top': (embedded ? '0' : '25px'), 'margin-top': (embedded ? '-10px' : '0'), 'margin-bottom': '24px'}">
                <tab-buttons v-bind:style="tmp[layer].componentStyles['tab-buttons']" :layer="layer"
                             :data="tmp[layer].tabFormat" :name="'mainTabs'"></tab-buttons>
              </div>
              <layer-tab v-if="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer"
                         :layer="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer" :embedded="true"
                         :key="this.$vnode.key + '-' + layer"></layer-tab>
              <column v-else :layer="layer" :data="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].content"
                      :key="this.$vnode.key + '-col'"></column>
            </div>
          </div>
          </div>
		`
	},

	"overlay-head": {
		template: `
		<div class="overlayThing" style="padding-bottom:7px; width: 90%; z-index: 1000; position: relative">
		<span v-if="player.devSpeed && player.devSpeed != 1" class="overlayThing">
			<br>Dev Speed: {{format(player.devSpeed)}}x<br>
		</span>
		<span v-if="player.offTime !== undefined"  class="overlayThing">
			<br>Offline Time: {{formatTime(player.offTime.remain)}}<br>
		</span>
		<br>
		<span v-if="canGenPoints()"  class="overlayThing">({{tmp.other.oompsMag != 0 ? format(tmp.other.oomps) + " OOM" + (tmp.other.oompsMag < 0 ? "^OOM" : tmp.other.oompsMag > 1 ? "^" + tmp.other.oompsMag : "") + "s" : formatSmall(getPointGen())}}/sec)</span>
		<div v-for="thing in tmp.displayThings" class="overlayThing"><span v-if="thing" v-html="thing"></span></div>
	</div>
	`
	},

	"info-tab": {
		template: `
        <div>
        <h2>{{modInfo.name}}</h2>
        <br>
        <h3>{{VERSION.withName}}</h3>
        <span v-if="modInfo.author">
            <br>
            Made by {{modInfo.author}}
        </span>
        <br>
        The Modding Tree <a v-bind:href="'https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md'" target="_blank" class="link" v-bind:style = "{'font-size': '14px', 'display': 'inline'}" >{{TMT_VERSION.tmtNum}}</a> by Acamaeda
        <br>
        The Prestige Tree made by Jacorb and Aarex
        <br>
        Original idea by papyrus (on discord)
        <br>
        Hourglass used with modifications from <a v-bind:href="'https://codepen.io/jkantner/pen/wvWXyKG'" target="_blank" class="link" v-bind:style = "{'font-size': '14px', 'display': 'inline'}" >jkantner</a> under MIT license
    <br><br>
        <img :src="'https://thepaperpilot.tech/nocount/tag.svg?url=' + encodeURIComponent(window.location.href)" alt="Hits" />
		<br><br>
		<div class="link" onclick="showTab('changelog-tab')">Changelog</div><br>
        <span v-if="modInfo.discordLink"><a class="link" v-bind:href="modInfo.discordLink" target="_blank">{{modInfo.discordName}}</a><br></span>
        <a class="link" href="https://discord.gg/F3xveHV" target="_blank" v-bind:style="modInfo.discordLink ? {'font-size': '16px'} : {}">The Modding Tree Discord</a><br>
        <a class="link" href="http://discord.gg/wwQfgPa" target="_blank" v-bind:style="{'font-size': '16px'}">Main Prestige Tree server</a><br>
		<br><br>
        Time Played: {{ formatTime(player.timePlayed) }}<br>
        <span v-if="player.chapterTime[1] > 0">Chapter 1 Time: {{ formatTime(player.chapterTime[1]) }}</span><br>
        <span v-if="player.chapterTime[2] > 0">Chapter 2 Time: {{ formatTime(player.chapterTime[2]) }}</span><br>
        <span v-if="player.chapterTime[3] > 0">Chapter 3 Time: {{ formatTime(player.chapterTime[3]) }}</span><br>
        <span v-if="player.chapterTime[4] > 0">Chapter 4 Time: {{ formatTime(player.chapterTime[4]) }}</span><br>
        <span v-if="player.chapterTime[5] > 0">Chapter 5 Time: {{ formatTime(player.chapterTime[5]) }}</span><br><br>
        <h3 v-if="Object.keys(hotkeys) > 0">Hotkeys</h3><br>
        <span v-for="key in hotkeys" v-if="player[key.layer].unlocked && tmp[key.layer].hotkeys[key.id].unlocked"><br>{{key.description}}</span>
      </div>
    `
	},

	"options-tab": {
		template: `
        <table>
            <tr>
                <td><button class="opt" onclick="save()">Save</button></td>
                <td><button class="opt" onclick="toggleOpt('autosave')">Autosave: {{ player.autosave?"ON":"OFF" }}</button></td>
                <td><button class="opt" onclick="hardReset()">HARD RESET</button></td>
            </tr>
            <tr>
                <td><button class="opt" onclick="exportSave()">Export to clipboard</button></td>
                <td><button class="opt" onclick="importSave()">Import</button></td>
                <td><button class="opt" onclick="toggleOpt('offlineProd')">Offline Prod: {{ player.offlineProd?"ON":"OFF" }}</button></td>
            </tr>
            <tr>
                <td><button class="opt" onclick="adjustMSDisp()">Show Milestones: {{ MS_DISPLAYS[MS_SETTINGS.indexOf(player.msDisplay)]}}</button></td>
								<td><button class="opt" onclick="toggleOpt('forceOneTab'); needsCanvasUpdate = true">Single-Tab Mode: {{ player.forceOneTab?"ALWAYS":"AUTO" }}</button></td>
						</tr>
        </table>`
	},

	"back-button": {
		template: `
        <button v-bind:class="back" onclick="goBack()">←</button>
        `
    },


	'tooltip' : {
		props: ['text'],
		template: `<div class="tooltip" v-html="text"></div>
		`
	},

	'node-mark': {
		props: ['layer', 'data'],
		template: `<div v-if='data'>
			<div v-if='data === true' class='star' style='position: absolute; left: -10px; top: -10px;'></div>
			<img v-else class='mark' style='position: absolute; left: -25px; top: -10px;' v-bind:src="data"></div>
		</div>
		`
	}
}
