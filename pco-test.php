<?php
/* Template Name: Events */

get_header();
?>

<style type="text/css">
	#wrapper {
		width: 100vw;
		height: 100vh;
	}

	iframe {
		border-radius: 0 !important;
	}
</style>

<div class="hero mbsm30">
	<div
		class="leftgrad desktop-only"
		style="background:linear-gradient(to bottom,#C67B69,#1281AC)"
	>
		<span style="background:#C67B69"></span>
	</div>

	<div class="img overlay relative">
		<img
			src="<?php bloginfo('url'); ?>/wp-content/uploads/2022/01/3eb1b43e1ff794641c1ed159bd298ee4.jpg"
			alt="people sitting at tables"
			class="imgcover"
		>
	</div>

	<div class="text-center relative">
		<h1 class="white mb50 mbsm30 fade1">
			Events
		</h1>

		<div class="text-center fade2">
			<a
				href="https://makerschurch.churchcenter.com/calendar"
				target="_blank"
				class="btn mrmd30 mbsm30"
			>
				Church Calendar
			</a>

			<br class="mobile-only">

			<a
				href="<?php bloginfo('url'); ?>/manifesto/"
				class="btn light white"
			>
				Visit
			</a>
		</div>
	</div>
</div>


<div class="row mb50">
	<div class="col-md-6 desktop-only"></div>

	<div class="col-md-6">
		<h1 class="orange mb30 plsm15">
			Upcoming<br>Events
		</h1>

		<div class="linein orangebg partsm"></div>
	</div>
</div>


<div class="container">
	<div class="row justcent">

<?php

/*
|--------------------------------------------------------------------------
| PLANNING CENTER AUTHENTICATION
|--------------------------------------------------------------------------
|
| Paste ONLY the Base64 Basic Auth value here.
|
| Better long-term:
| move this into wp-config.php or an environment variable.
|
*/

$pco_basic_auth = 'YOUR_PLANNING_CENTER_BASIC_AUTH_HERE';


/*
|--------------------------------------------------------------------------
| SET UP CURL
|--------------------------------------------------------------------------
*/

$ch = curl_init();

curl_setopt($ch,CURLOPT_HTTPHEADER,array('Authorization: Basic Yjc4NjRlNzg5NjNjOTA1OTg5NjJkMzkzMTJhMjhkYzhkNWJlMDZiZjJkNDZhZmQ4MjE5ZTVjZTNhZTI1YmVhOToyM2IxZDdiMGMyYzNhZjM4NThkZmExYWQxOWU0NTUxNzcxMTExNWU1M2E0Y2NiYzIxZDBkNTUyMmZmZDc0MDIz'));

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// curl_setopt(
// 	$ch,
// 	CURLOPT_USERAGENT,
// 	'Makers Church WordPress Events'
// );


/*
|--------------------------------------------------------------------------
| RATE-LIMIT-AWARE PCO GET FUNCTION
|--------------------------------------------------------------------------
|
| If Planning Center returns 429:
|
| 1. Read Retry-After
| 2. Wait
| 3. Retry automatically
|
| Maximum 3 retries.
|
*/

function makers_pco_get($ch, $url, $max_retries = 3) {

	$attempt = 0;

	while ($attempt <= $max_retries) {

		$response_headers = array();


		/*
		|--------------------------------------------------------------------------
		| CAPTURE RESPONSE HEADERS
		|--------------------------------------------------------------------------
		*/

		curl_setopt(
			$ch,
			CURLOPT_HEADERFUNCTION,
			function($curl, $header) use (&$response_headers) {

				$length = strlen($header);

				$parts = explode(':', $header, 2);

				if (count($parts) === 2) {

					$name =
						strtolower(
							trim($parts[0])
						);

					$value =
						trim($parts[1]);

					$response_headers[$name] =
						$value;
				}

				return $length;
			}
		);


		curl_setopt(
			$ch,
			CURLOPT_URL,
			$url
		);


		$body =
			curl_exec($ch);


		$status =
			curl_getinfo(
				$ch,
				CURLINFO_HTTP_CODE
			);


		$curl_error =
			curl_error($ch);


		/*
		|--------------------------------------------------------------------------
		| RATE LIMIT INFORMATION
		|--------------------------------------------------------------------------
		*/

		$rate_limit =
			isset($response_headers['x-pco-api-request-rate-limit'])
				? (int) $response_headers['x-pco-api-request-rate-limit']
				: null;


		$rate_count =
			isset($response_headers['x-pco-api-request-rate-count'])
				? (int) $response_headers['x-pco-api-request-rate-count']
				: null;


		$rate_period =
			isset($response_headers['x-pco-api-request-rate-period'])
				? $response_headers['x-pco-api-request-rate-period']
				: null;


		/*
		|--------------------------------------------------------------------------
		| NORMAL RESPONSE
		|--------------------------------------------------------------------------
		*/

		if ($status !== 429) {

			return array(

				'status' =>
					$status,

				'body' =>
					$body,

				'data' =>
					json_decode(
						$body,
						true
					),

				'headers' =>
					$response_headers,

				'curl_error' =>
					$curl_error,

				'retries' =>
					$attempt,

				'rate_limit' =>
					$rate_limit,

				'rate_count' =>
					$rate_count,

				'rate_period' =>
					$rate_period,

				'rate_limited' =>
					false

			);
		}


		/*
		|--------------------------------------------------------------------------
		| WE RECEIVED 429
		|--------------------------------------------------------------------------
		*/

		$retry_after = 1;


		if (
			isset($response_headers['retry-after']) &&
			is_numeric($response_headers['retry-after'])
		) {

			$retry_after =
				max(
					1,
					(int) $response_headers['retry-after']
				);
		}


		/*
		|--------------------------------------------------------------------------
		| MAX RETRIES REACHED
		|--------------------------------------------------------------------------
		*/

		if ($attempt >= $max_retries) {

			return array(

				'status' =>
					$status,

				'body' =>
					$body,

				'data' =>
					json_decode(
						$body,
						true
					),

				'headers' =>
					$response_headers,

				'curl_error' =>
					$curl_error,

				'retries' =>
					$attempt,

				'rate_limit' =>
					$rate_limit,

				'rate_count' =>
					$rate_count,

				'rate_period' =>
					$rate_period,

				'rate_limited' =>
					true,

				'retry_after' =>
					$retry_after

			);
		}


		/*
		|--------------------------------------------------------------------------
		| WAIT EXACTLY AS LONG AS PCO REQUESTS
		|--------------------------------------------------------------------------
		*/

		sleep($retry_after);


		$attempt++;
	}


	return null;
}


/*
|--------------------------------------------------------------------------
| REGISTRATION DEBUGGING — DISABLED
|--------------------------------------------------------------------------
|
| Set to true to run the registration/attendee API calls and console logs.
|
*/

$show_registration_debug = false;

if ($show_registration_debug) :


/*
|--------------------------------------------------------------------------
| EVENT TO INSPECT
|--------------------------------------------------------------------------
*/

$signup_id = '3862577';


/*
|--------------------------------------------------------------------------
| STEP 1:
| GET REGISTRATIONS FOR THIS EVENT
|--------------------------------------------------------------------------
*/

$registration_ids =
	array();


$registrations_raw =
	array();


$registrations_http_code =
	null;


$registrations_curl_error =
	'';


$registrations_retries =
	0;


$registrations_url =
	'https://api.planningcenteronline.com/registrations/v2/signups/' .
	rawurlencode($signup_id) .
	'/registrations?per_page=100';


$next_registrations_url =
	$registrations_url;


while (!empty($next_registrations_url)) {


	$response =
		makers_pco_get(
			$ch,
			$next_registrations_url
		);


	if (!$response) {
		break;
	}


	$registrations_http_code =
		$response['status'];


	$registrations_curl_error =
		$response['curl_error'];


	$registrations_retries +=
		$response['retries'];


	$registrations_data =
		$response['data'];


	$registrations_raw[] =
		$registrations_data;


	/*
	|--------------------------------------------------------------------------
	| STOP IF PCO RETURNED INVALID DATA
	|--------------------------------------------------------------------------
	*/

	if (
		!is_array($registrations_data) ||
		!isset($registrations_data['data']) ||
		!is_array($registrations_data['data'])
	) {

		break;
	}


	/*
	|--------------------------------------------------------------------------
	| COLLECT REGISTRATION IDS
	|--------------------------------------------------------------------------
	*/

	foreach (
		$registrations_data['data']
		as $registration
	) {

		if (!empty($registration['id'])) {

			$registration_ids[] =
				(string) $registration['id'];
		}
	}


	/*
	|--------------------------------------------------------------------------
	| PAGINATION
	|--------------------------------------------------------------------------
	*/

	if (
		isset($registrations_data['links']) &&
		!empty($registrations_data['links']['next'])
	) {

		$next_registrations_url =
			$registrations_data['links']['next'];

	} else {

		$next_registrations_url =
			null;
	}
}


/*
|--------------------------------------------------------------------------
| REMOVE DUPLICATES
|--------------------------------------------------------------------------
*/

$registration_ids =
	array_values(
		array_unique(
			$registration_ids
		)
	);


/*
|--------------------------------------------------------------------------
| CREATE FAST REGISTRATION LOOKUP
|--------------------------------------------------------------------------
|
| Instead of calling in_array() repeatedly:
|
| $registration_lookup['85634354'] = true;
|
*/

$registration_lookup =
	array_fill_keys(
		$registration_ids,
		true
	);


/*
|--------------------------------------------------------------------------
| STEP 2:
| GET ATTENDEES
|--------------------------------------------------------------------------
|
| Each Attendee represents an actual individual person.
|
| We include registration so we can determine which registration each
| attendee belongs to.
|
*/

$all_attendees =
	array();


$attendees_raw =
	array();


$attendees_http_code =
	null;


$attendees_curl_error =
	'';


$attendees_retries =
	0;


$attendees_rate_limit =
	null;


$attendees_rate_count =
	null;


$attendees_rate_period =
	null;


$attendees_url =
	'https://api.planningcenteronline.com/registrations/v2/attendees' .
	'?per_page=100' .
	'&include=registration' .
	'&fields%5BAttendee%5D=name,active,canceled,waitlisted,waitlisted_at,created_at';


$next_attendees_url =
	$attendees_url;


/*
|--------------------------------------------------------------------------
| PAGINATE THROUGH ATTENDEES
|--------------------------------------------------------------------------
*/

while (!empty($next_attendees_url)) {


	$response =
		makers_pco_get(
			$ch,
			$next_attendees_url
		);


	if (!$response) {
		break;
	}


	$attendees_http_code =
		$response['status'];


	$attendees_curl_error =
		$response['curl_error'];


	$attendees_retries +=
		$response['retries'];


	$attendees_rate_limit =
		$response['rate_limit'];


	$attendees_rate_count =
		$response['rate_count'];


	$attendees_rate_period =
		$response['rate_period'];


	$attendees_data =
		$response['data'];


	$attendees_raw[] =
		$attendees_data;


	/*
	|--------------------------------------------------------------------------
	| STOP ON API ERROR
	|--------------------------------------------------------------------------
	*/

	if (
		!is_array($attendees_data) ||
		!isset($attendees_data['data']) ||
		!is_array($attendees_data['data'])
	) {

		break;
	}


	/*
	|--------------------------------------------------------------------------
	| PROCESS ATTENDEES
	|--------------------------------------------------------------------------
	*/

	foreach (
		$attendees_data['data']
		as $attendee
	) {


		$registration_id =
			'';


		/*
		|--------------------------------------------------------------------------
		| FIND THIS ATTENDEE'S REGISTRATION
		|--------------------------------------------------------------------------
		*/

		if (
			isset($attendee['relationships']) &&
			isset($attendee['relationships']['registration']) &&
			isset($attendee['relationships']['registration']['data']) &&
			isset($attendee['relationships']['registration']['data']['id'])
		) {

			$registration_id =
				(string)
				$attendee['relationships']['registration']['data']['id'];
		}


		/*
		|--------------------------------------------------------------------------
		| SKIP ATTENDEES FROM OTHER EVENTS
		|--------------------------------------------------------------------------
		*/

		if (
			empty($registration_id) ||
			!isset($registration_lookup[$registration_id])
		) {

			continue;
		}


		/*
		|--------------------------------------------------------------------------
		| ATTENDEE ATTRIBUTES
		|--------------------------------------------------------------------------
		*/

		$attributes =
			isset($attendee['attributes']) &&
			is_array($attendee['attributes'])
				? $attendee['attributes']
				: array();


		$is_active =
			!empty($attributes['active']);


		$is_canceled =
			!empty($attributes['canceled']);


		$is_waitlisted =
			!empty($attributes['waitlisted']);


		/*
		|--------------------------------------------------------------------------
		| DETERMINE STATUS
		|--------------------------------------------------------------------------
		*/

		if ($is_canceled) {

			$status =
				'Canceled';

		} elseif ($is_waitlisted) {

			$status =
				'Waitlisted';

		} elseif ($is_active) {

			$status =
				'Confirmed';

		} else {

			$status =
				'Inactive';
		}


		/*
		|--------------------------------------------------------------------------
		| SAVE PERSON
		|--------------------------------------------------------------------------
		*/

		$all_attendees[] = array(

			'attendee_id' =>
				isset($attendee['id'])
					? (string) $attendee['id']
					: '',

			'registration_id' =>
				$registration_id,

			'name' =>
				isset($attributes['name'])
					? $attributes['name']
					: '',

			'status' =>
				$status,

			'active' =>
				$is_active,

			'waitlisted' =>
				$is_waitlisted,

			'canceled' =>
				$is_canceled,

			'registered_at' =>
				isset($attributes['created_at'])
					? $attributes['created_at']
					: '',

			'waitlisted_at' =>
				isset($attributes['waitlisted_at'])
					? $attributes['waitlisted_at']
					: ''
		);
	}


	/*
	|--------------------------------------------------------------------------
	| ATTENDEE PAGINATION
	|--------------------------------------------------------------------------
	*/

	if (
		isset($attendees_data['links']) &&
		!empty($attendees_data['links']['next'])
	) {

		$next_attendees_url =
			$attendees_data['links']['next'];

	} else {

		$next_attendees_url =
			null;
	}
}


/*
|--------------------------------------------------------------------------
| SORT PEOPLE BY NAME
|--------------------------------------------------------------------------
*/

usort(
	$all_attendees,
	function($a, $b) {

		return strcasecmp(
			$a['name'],
			$b['name']
		);
	}
);


/*
|--------------------------------------------------------------------------
| BUILD COUNTS
|--------------------------------------------------------------------------
*/

$confirmed_count =
	0;


$waitlisted_count =
	0;


$canceled_count =
	0;


$inactive_count =
	0;


foreach ($all_attendees as $person) {

	switch ($person['status']) {

		case 'Confirmed':

			$confirmed_count++;

			break;


		case 'Waitlisted':

			$waitlisted_count++;

			break;


		case 'Canceled':

			$canceled_count++;

			break;


		default:

			$inactive_count++;

			break;
	}
}


/*
|--------------------------------------------------------------------------
| CONSOLE DEBUGGING
|--------------------------------------------------------------------------
*/

?>


<script>

(function() {

	const registrationIds =
		<?php echo wp_json_encode($registration_ids); ?>;


	const attendees =
		<?php echo wp_json_encode($all_attendees); ?>;


	const rawRegistrations =
		<?php echo wp_json_encode($registrations_raw); ?>;


	const rawAttendees =
		<?php echo wp_json_encode($attendees_raw); ?>;


	const summary = {

		registrations:
			<?php echo (int) count($registration_ids); ?>,

		totalPeople:
			<?php echo (int) count($all_attendees); ?>,

		confirmed:
			<?php echo (int) $confirmed_count; ?>,

		waitlisted:
			<?php echo (int) $waitlisted_count; ?>,

		canceled:
			<?php echo (int) $canceled_count; ?>,

		inactive:
			<?php echo (int) $inactive_count; ?>

	};


	console.group(
		'PLANNING CENTER — EVENT <?php echo esc_js($signup_id); ?>'
	);


	/*
	|--------------------------------------------------------------------------
	| API STATUS
	|--------------------------------------------------------------------------
	*/

	console.log(
		'REGISTRATIONS HTTP STATUS:',
		<?php echo wp_json_encode($registrations_http_code); ?>
	);


	console.log(
		'REGISTRATIONS CURL ERROR:',
		<?php echo wp_json_encode($registrations_curl_error); ?>
	);


	console.log(
		'REGISTRATION RETRIES:',
		<?php echo (int) $registrations_retries; ?>
	);


	console.log(
		'ATTENDEES HTTP STATUS:',
		<?php echo wp_json_encode($attendees_http_code); ?>
	);


	console.log(
		'ATTENDEES CURL ERROR:',
		<?php echo wp_json_encode($attendees_curl_error); ?>
	);


	console.log(
		'ATTENDEE RETRIES:',
		<?php echo (int) $attendees_retries; ?>
	);


	/*
	|--------------------------------------------------------------------------
	| RATE LIMIT INFO
	|--------------------------------------------------------------------------
	*/

	console.log(
		'PCO RATE LIMIT:',
		<?php echo wp_json_encode($attendees_rate_limit); ?>
	);


	console.log(
		'PCO REQUEST COUNT:',
		<?php echo wp_json_encode($attendees_rate_count); ?>
	);


	console.log(
		'PCO RATE PERIOD:',
		<?php echo wp_json_encode($attendees_rate_period); ?>
	);


	/*
	|--------------------------------------------------------------------------
	| EVENT REGISTRATIONS
	|--------------------------------------------------------------------------
	*/

	console.log(
		'EVENT REGISTRATION IDS:',
		registrationIds
	);


	/*
	|--------------------------------------------------------------------------
	| SUMMARY
	|--------------------------------------------------------------------------
	*/

	console.log(
		'SUMMARY:',
		summary
	);


	console.log(
		'REGISTRATIONS:',
		summary.registrations
	);


	console.log(
		'TOTAL PEOPLE:',
		summary.totalPeople
	);


	console.log(
		'CONFIRMED:',
		summary.confirmed
	);


	console.log(
		'WAITLISTED:',
		summary.waitlisted
	);


	console.log(
		'CANCELED:',
		summary.canceled
	);


	console.log(
		'INACTIVE:',
		summary.inactive
	);


	/*
	|--------------------------------------------------------------------------
	| ALL PEOPLE
	|--------------------------------------------------------------------------
	*/

	console.log(
		'ALL PEOPLE:'
	);


	console.table(

		attendees.map(function(person) {

			return {

				name:
					person.name,

				status:
					person.status,

				registration_id:
					person.registration_id,

				registered_at:
					person.registered_at,

				waitlisted_at:
					person.waitlisted_at

			};

		})

	);


	/*
	|--------------------------------------------------------------------------
	| CONFIRMED
	|--------------------------------------------------------------------------
	*/

	const confirmed =
		attendees.filter(function(person) {

			return person.status === 'Confirmed';

		});


	console.log(
		'CONFIRMED PEOPLE:'
	);


	console.table(

		confirmed.map(function(person) {

			return {

				name:
					person.name,

				registration_id:
					person.registration_id,

				registered_at:
					person.registered_at

			};

		})

	);


	/*
	|--------------------------------------------------------------------------
	| WAITLISTED
	|--------------------------------------------------------------------------
	*/

	const waitlisted =
		attendees.filter(function(person) {

			return person.status === 'Waitlisted';

		});


	console.log(
		'WAITLISTED PEOPLE:'
	);


	console.table(

		waitlisted.map(function(person) {

			return {

				name:
					person.name,

				registration_id:
					person.registration_id,

				registered_at:
					person.registered_at,

				waitlisted_at:
					person.waitlisted_at

			};

		})

	);


	/*
	|--------------------------------------------------------------------------
	| CANCELED
	|--------------------------------------------------------------------------
	*/

	const canceled =
		attendees.filter(function(person) {

			return person.status === 'Canceled';

		});


	console.log(
		'CANCELED PEOPLE:'
	);


	console.table(

		canceled.map(function(person) {

			return {

				name:
					person.name,

				registration_id:
					person.registration_id,

				registered_at:
					person.registered_at

			};

		})

	);


	/*
	|--------------------------------------------------------------------------
	| RAW DATA
	|--------------------------------------------------------------------------
	*/

	console.log(
		'RAW REGISTRATION RESPONSES:',
		rawRegistrations
	);


	console.log(
		'RAW ATTENDEE RESPONSES:',
		rawAttendees
	);


	console.groupEnd();

})();

</script>

<?php endif; ?>


<?php

/*
|--------------------------------------------------------------------------
| PCO SERVICES — TODAY + NEXT UPCOMING SERVICES
|--------------------------------------------------------------------------
|
| Assumes your existing authenticated $ch already exists.
|
| Today: October 4, 2026
| Number of plans to show: today + next 4
|
*/

$target_date = '2026-10-04';
$number_of_plans = 5;

$service_types_url =
	'https://api.planningcenteronline.com/services/v2/service_types?per_page=100';

curl_setopt($ch, CURLOPT_URL, $service_types_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$service_types_res = curl_exec($ch);
$service_types_http = curl_getinfo($ch, CURLINFO_HTTP_CODE);

$service_types_data = json_decode(
	$service_types_res,
	true
);


/*
|--------------------------------------------------------------------------
| COLLECT SERVICE TYPES
|--------------------------------------------------------------------------
*/

$service_types = array();

if (
	$service_types_http == 200 &&
	!empty($service_types_data['data'])
) {

	foreach ($service_types_data['data'] as $service_type) {

		$service_types[] = array(
			'id' => $service_type['id'],
			'name' => isset($service_type['attributes']['name'])
				? $service_type['attributes']['name']
				: ''
		);
	}
}


/*
|--------------------------------------------------------------------------
| GET UPCOMING PLANS
|--------------------------------------------------------------------------
|
| We're requesting plans beginning on/after October 4.
|
*/

$plans = array();

foreach ($service_types as $service_type) {

	$service_type_id = $service_type['id'];

	$plans_url =
		'https://api.planningcenteronline.com/services/v2/service_types/' .
		rawurlencode($service_type_id) .
		'/plans' .
		'?filter=after' .
		'&after=' . rawurlencode($target_date . 'T00:00:00Z') .
		'&order=sort_date' .
		'&per_page=25';


	curl_setopt($ch, CURLOPT_URL, $plans_url);

	$plans_res = curl_exec($ch);

	$plans_http =
		curl_getinfo(
			$ch,
			CURLINFO_HTTP_CODE
		);

	$plans_data =
		json_decode(
			$plans_res,
			true
		);


	if (
		$plans_http != 200 ||
		empty($plans_data['data'])
	) {
		continue;
	}


	foreach ($plans_data['data'] as $plan) {

		$attrs =
			isset($plan['attributes'])
				? $plan['attributes']
				: array();


		$plans[] = array(

			'service_type_id' =>
				$service_type_id,

			'service_type_name' =>
				$service_type['name'],

			'plan_id' =>
				$plan['id'],

			'title' =>
				isset($attrs['title'])
					? $attrs['title']
					: '',

			'dates' =>
				isset($attrs['dates'])
					? $attrs['dates']
					: '',

			'short_dates' =>
				isset($attrs['short_dates'])
					? $attrs['short_dates']
					: '',

			'sort_date' =>
				isset($attrs['sort_date'])
					? $attrs['sort_date']
					: '',

			'plan_people_count' =>
				isset($attrs['plan_people_count'])
					? $attrs['plan_people_count']
					: 0,

			'people' =>
				array()

		);
	}
}


/*
|--------------------------------------------------------------------------
| SORT ALL PLANS CHRONOLOGICALLY
|--------------------------------------------------------------------------
|
| This combines plans from BOTH Service Types.
|
*/

usort(
	$plans,
	function($a, $b) {

		return strtotime($a['sort_date'])
			<=> strtotime($b['sort_date']);
	}
);


/*
|--------------------------------------------------------------------------
| KEEP TODAY + NEXT FEW SERVICES
|--------------------------------------------------------------------------
*/

$plans =
	array_slice(
		$plans,
		0,
		$number_of_plans
	);


/*
|--------------------------------------------------------------------------
| GET EVERY PERSON SCHEDULED FOR EACH PLAN
|--------------------------------------------------------------------------
*/

foreach ($plans as $index => $plan) {

	$team_members_url =
		'https://api.planningcenteronline.com/services/v2/service_types/' .
		rawurlencode($plan['service_type_id']) .
		'/plans/' .
		rawurlencode($plan['plan_id']) .
		'/team_members' .
		'?per_page=100';


	curl_setopt(
		$ch,
		CURLOPT_URL,
		$team_members_url
	);


	$people_res =
		curl_exec($ch);


	$people_http =
		curl_getinfo(
			$ch,
			CURLINFO_HTTP_CODE
		);


	$people_data =
		json_decode(
			$people_res,
			true
		);


	/*
	|--------------------------------------------------------------------------
	| STORE API STATUS FOR DEBUGGING
	|--------------------------------------------------------------------------
	*/

	$plans[$index]['people_http_status'] =
		$people_http;


	/*
	|--------------------------------------------------------------------------
	| PROCESS SCHEDULED PEOPLE
	|--------------------------------------------------------------------------
	*/

	if (
		$people_http == 200 &&
		!empty($people_data['data'])
	) {

		foreach ($people_data['data'] as $person) {

			$attrs =
				isset($person['attributes'])
					? $person['attributes']
					: array();


			/*
			|--------------------------------------------------------------------------
			| STATUS
			|--------------------------------------------------------------------------
			|
			| Typical values may include:
			|
			| C = Confirmed
			| U = Unconfirmed
			| D = Declined
			|
			*/

			$status =
				isset($attrs['status'])
					? $attrs['status']
					: '';


			switch ($status) {

				case 'C':
					$status_label = 'Confirmed';
					break;

				case 'D':
					$status_label = 'Declined';
					break;

				case 'U':
					$status_label = 'Unconfirmed';
					break;

				default:
					$status_label = $status;
					break;
			}


			$plans[$index]['people'][] =
				array(

					'name' =>
						isset($attrs['name'])
							? $attrs['name']
							: '',

					'position' =>
						isset($attrs['team_position_name'])
							? $attrs['team_position_name']
							: '',

					'status' =>
						$status_label,

					'status_code' =>
						$status,

					'team_id' =>
						isset(
							$person['relationships']['team']['data']['id']
						)
							? $person['relationships']['team']['data']['id']
							: '',

					'person_id' =>
						isset(
							$person['relationships']['person']['data']['id']
						)
							? $person['relationships']['person']['data']['id']
							: ''

				);
		}
	}
}


/*
|--------------------------------------------------------------------------
| OPTIONAL — GET TEAM NAMES
|--------------------------------------------------------------------------
|
| The PlanPerson records give us the team ID.
| Let's retrieve the teams so the console says:
|
| Worship
| Production
| Hospitality
|
| instead of only showing IDs.
|
*/

$team_names = array();


foreach ($service_types as $service_type) {

	$teams_url =
		'https://api.planningcenteronline.com/services/v2/service_types/' .
		rawurlencode($service_type['id']) .
		'/teams?per_page=100';


	curl_setopt(
		$ch,
		CURLOPT_URL,
		$teams_url
	);


	$teams_res =
		curl_exec($ch);


	$teams_http =
		curl_getinfo(
			$ch,
			CURLINFO_HTTP_CODE
		);


	$teams_data =
		json_decode(
			$teams_res,
			true
		);


	if (
		$teams_http == 200 &&
		!empty($teams_data['data'])
	) {

		foreach ($teams_data['data'] as $team) {

			$team_names[$team['id']] =
				isset($team['attributes']['name'])
					? $team['attributes']['name']
					: '';
		}
	}
}


/*
|--------------------------------------------------------------------------
| ADD TEAM NAMES TO PEOPLE
|--------------------------------------------------------------------------
*/

foreach ($plans as $plan_index => $plan) {

	foreach ($plan['people'] as $person_index => $person) {

		$team_id =
			$person['team_id'];


		$plans[$plan_index]['people'][$person_index]['team'] =
			isset($team_names[$team_id])
				? $team_names[$team_id]
				: '';
	}
}

?>


<script>

(function() {

	const plans =
		<?php echo wp_json_encode($plans); ?>;


	console.group(
		'PCO SERVICES — OCTOBER 4, 2026 + UPCOMING'
	);


	console.log(
		'NUMBER OF PLANS:',
		plans.length
	);


	/*
	|--------------------------------------------------------------------------
	| SUMMARY TABLE
	|--------------------------------------------------------------------------
	*/

	console.log('SERVICE SUMMARY:');

	console.table(

		plans.map(function(plan) {

			return {

				date:
					plan.dates,

				service_type:
					plan.service_type_name,

				title:
					plan.title,

				scheduled_people:
					plan.people.length,

				api_status:
					plan.people_http_status,

				plan_id:
					plan.plan_id

			};

		})

	);


	/*
	|--------------------------------------------------------------------------
	| EACH SERVICE
	|--------------------------------------------------------------------------
	*/

	plans.forEach(function(plan) {


		const heading =
			(plan.dates || plan.short_dates || 'Service') +
			' — ' +
			plan.service_type_name +
			(plan.title ? ' — ' + plan.title : '');


		console.group(heading);


		console.log(
			'Plan ID:',
			plan.plan_id
		);


		console.log(
			'Date:',
			plan.dates
		);


		console.log(
			'Service Type:',
			plan.service_type_name
		);


		console.log(
			'PCO Plan People Count:',
			plan.plan_people_count
		);


		console.log(
			'People API Status:',
			plan.people_http_status
		);


		console.log(
			'SCHEDULED PEOPLE:',
			plan.people.length
		);


		/*
		|--------------------------------------------------------------------------
		| ALL SCHEDULED PEOPLE
		|--------------------------------------------------------------------------
		*/

		console.table(

			plan.people.map(function(person) {

				return {

					name:
						person.name,

					team:
						person.team,

					position:
						person.position,

					status:
						person.status

				};

			})

		);


		/*
		|--------------------------------------------------------------------------
		| GROUP BY TEAM
		|--------------------------------------------------------------------------
		*/

		const teams = {};


		plan.people.forEach(function(person) {

			const team =
				person.team || 'No Team';


			if (!teams[team]) {
				teams[team] = [];
			}


			teams[team].push(person);

		});


		Object.keys(teams).forEach(function(team) {

			console.group(team);


			console.table(

				teams[team].map(function(person) {

					return {

						name:
							person.name,

						position:
							person.position,

						status:
							person.status

					};

				})

			);


			console.groupEnd();

		});


		console.groupEnd();

	});


	console.groupEnd();

})();

</script>


<?php

/*
|--------------------------------------------------------------------------
| LOAD UPCOMING EVENTS
|--------------------------------------------------------------------------
*/

$next =
	'https://api.planningcenteronline.com/registrations/v2/events?filter=future,active&per_page=100';


$events =
	array();


$indexes =
	array();


$i =
	90000000;


while (!empty($next)) {


	/*
	|--------------------------------------------------------------------------
	| USE SAME RATE-LIMIT-AWARE HELPER
	|--------------------------------------------------------------------------
	*/

	$response =
		makers_pco_get(
			$ch,
			$next
		);


	if (!$response) {
		break;
	}


	$data =
		$response['data'];


	if (
		!is_array($data) ||
		!isset($data['data']) ||
		!is_array($data['data'])
	) {

		break;
	}


	foreach ($data['data'] as $e) {


		if (
			!isset($e['attributes']) ||
			!is_array($e['attributes'])
		) {

			continue;
		}


		$a =
			$e['attributes'];


		/*
		|--------------------------------------------------------------------------
		| IGNORE LINK-ONLY EVENTS
		|--------------------------------------------------------------------------
		*/

		if (
			isset($a['link_only']) &&
			$a['link_only']
		) {

			continue;
		}


		/*
		|--------------------------------------------------------------------------
		| CREATE SORT INDEX
		|--------------------------------------------------------------------------
		*/

		if (!empty($a['event_time_summary'])) {


			$date_value =
				!empty($a['hide_at'])
					? $a['hide_at']
					: $a['event_time_summary'];


			$timestamp =
				strtotime(
					$date_value
				);


			if ($timestamp !== false) {

				$ind =
					floatval(
						date(
							'Ymd.Hi',
							$timestamp
						)
					);

			} else {

				$ind =
					$i;
			}


			while (
				isset(
					$events[strval($ind)]
				)
			) {

				$ind +=
					0.0001;
			}


		} else {


			$ind =
				$i;
		}


		$indexes[] =
			$ind;


		/*
		|--------------------------------------------------------------------------
		| SAVE EVENT
		|--------------------------------------------------------------------------
		*/

		$events[strval($ind)] = array(

			'img' =>
				isset($a['logo_url'])
					? $a['logo_url']
					: '',

			'name' =>
				isset($a['name'])
					? $a['name']
					: '',

			'date' =>
				isset($a['event_time_summary'])
					? $a['event_time_summary']
					: '',

			'desc' =>
				isset($a['description'])
					? $a['description']
					: '',

			'url' =>
				isset($a['public_url'])
					? $a['public_url']
					: '',

			'featured' =>
				isset($a['featured'])
					? $a['featured']
					: false

		);


		$i++;
	}


	/*
	|--------------------------------------------------------------------------
	| EVENT PAGINATION
	|--------------------------------------------------------------------------
	*/

	if (
		isset($data['links']) &&
		!empty($data['links']['next'])
	) {

		$next =
			$data['links']['next'];

	} else {

		$next =
			null;
	}
}


/*
|--------------------------------------------------------------------------
| SORT EVENTS
|--------------------------------------------------------------------------
*/

sort(
	$indexes,
	SORT_NUMERIC
);


/*
|--------------------------------------------------------------------------
| SEPARATE FEATURED EVENTS
|--------------------------------------------------------------------------
*/

$featured =
	array();


foreach ($events as $b => $a) {

	if (!empty($a['featured'])) {

		$featured[$b] =
			$a;

		unset(
			$events[$b]
		);
	}
}


/*
|--------------------------------------------------------------------------
| DISPLAY FEATURED EVENTS
|--------------------------------------------------------------------------
*/

foreach ($featured as $b => $a):

	if (empty($a['name'])) {
		continue;
	}

?>

	<div class="col-lg-4 col-md-6 mb50">

		<div class="lightbox">

			<?php if (!empty($a['img'])): ?>

				<img
					src="<?php echo esc_url($a['img']); ?>"
					alt="<?php echo esc_attr($a['name']); ?> image"
					style="margin:-30px -30px 30px;width:calc(100% + 60px);max-width:initial"
				>

			<?php endif; ?>


			<h3 class="garamond orange2 text-center-sm">

				<?php echo esc_html($a['name']); ?>

			</h3>


			<?php if (!empty($a['date'])): ?>

				<h4 class="text-center-sm">

					<?php echo esc_html($a['date']); ?>

				</h4>

			<?php endif; ?>


			<div class="descover">

				<?php echo $a['desc']; ?>

			</div>


			<p
				class="m0 text-center-sm"
				style="margin-top:20px !important"
			>

				<a
					href="#"
					class="btn light descbtn mb15"
				>
					Read

					<span class="more">
						More
					</span>

					<span class="less">
						Less
					</span>

				</a>


				<a
					href="<?php echo esc_url($a['url']); ?>"
					target="_blank"
					class="btn"
				>
					Learn More
				</a>

			</p>

		</div>

	</div>

<?php

endforeach;


/*
|--------------------------------------------------------------------------
| DISPLAY NORMAL EVENTS
|--------------------------------------------------------------------------
*/

foreach ($indexes as $i):

	$event_key =
		strval($i);


	/*
	 * Featured events were removed above.
	 */

	if (!isset($events[$event_key])) {
		continue;
	}


	$a =
		$events[$event_key];


	if (empty($a['name'])) {
		continue;
	}

?>

	<div class="col-lg-4 col-md-6 mb50">

		<div class="lightbox">

			<?php if (!empty($a['img'])): ?>

				<img
					src="<?php echo esc_url($a['img']); ?>"
					alt="<?php echo esc_attr($a['name']); ?> image"
					style="margin:-30px -30px 30px;width:calc(100% + 60px);max-width:initial"
				>

			<?php endif; ?>


			<h3 class="garamond orange2 text-center-sm">

				<?php echo esc_html($a['name']); ?>

			</h3>


			<?php if (!empty($a['date'])): ?>

				<h4 class="text-center-sm">

					<?php echo esc_html($a['date']); ?>

				</h4>

			<?php endif; ?>


			<div class="descover">

				<?php echo $a['desc']; ?>

			</div>


			<p
				class="m0 text-center-sm"
				style="margin-top:20px !important"
			>

				<a
					href="#"
					class="btn light descbtn mb15"
				>
					Read

					<span class="more">
						More
					</span>

					<span class="less">
						Less
					</span>

				</a>


				<a
					href="<?php echo esc_url($a['url']); ?>"
					target="_blank"
					class="btn"
				>
					Learn More
				</a>

			</p>

		</div>

	</div>

<?php

endforeach;


/*
|--------------------------------------------------------------------------
| CLOSE CURL
|--------------------------------------------------------------------------
*/

curl_close($ch);

?>

	</div>
</div>


<?php get_footer(); ?>